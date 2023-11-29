import { Response } from 'express';
import { MongoClient, Collection } from "mongodb";
import { IUser } from './interfaces/users.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import bcrypt from 'bcrypt';
import { isEmptyObject } from '../common/utils/logad';
const jwt = require('jsonwebtoken');

export class UsersService {
	private usersCollection: Collection<IUser | Omit<IUser, '_id'>>;

	constructor(dbClient: MongoClient, dbName: string) {
		this.usersCollection = dbClient.db(dbName).collection("users");
	}

	async register(dto: RegisterUserDto, res: Response): Promise<Response> {
		try {

			if (isEmptyObject(dto)) {
				return res.status(400).send("Invalid Data");
			}

			const existingUser = await this.usersCollection.findOne({ login: dto.login });
			if (existingUser) {
				return res.status(400).send('User already exists');
			}
	
			const hashedPassword = await bcrypt.hash(dto.password, 12);
	
			const newUser = await this.usersCollection.insertOne({
				login: dto.login,
				password: hashedPassword
			});
	
			return res.status(201).json(newUser);
		} catch (err) {
			return res.status(500).send(err.message);
		}
	}

	async login(dto: LoginUserDto, res: Response): Promise<Response> {
		try {
			if (isEmptyObject(dto)) {
				return res.status(400).send("Invalid Data");
			}

			const user = await this.usersCollection.findOne({ login: dto.login });
			if (!user) {
				return res.status(400).send('User not found');
			}
	
			const isMatch = await bcrypt.compare(dto.password, user.password);
			if (!isMatch) {
				return res.status(400).send('Invalid credentials');
			}
	
			const token = jwt.sign({ userId: user._id }, 'opticmacros', { expiresIn: '1h' });
	
			return res.status(200).json({ ...user, token });
		} catch (err) {
			return res.status(500).send(err.message);
		}
	}
}
