import { IModule } from '../common/interfaces/module.interface';
import { Application } from "express";
import { MongoClient } from "mongodb";
import { UsersService } from './usesr.service';
import { UsersController } from './users.controller';
import { validateDTO } from '../common/middleware/validate-dto.middleware';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

export class UsersModule implements IModule {
	public service: UsersService;
	public controller: UsersController;

	constructor(dbClient: MongoClient, dbName: string) {
		this.service = new UsersService(dbClient, dbName);
		this.controller = new UsersController(this.service);
	}

	registerRouters(app: Application): void {
		app.post('/api/register', validateDTO(RegisterUserDto), this.controller.register);
		app.post('/api/login', validateDTO(LoginUserDto), this.controller.login);
	}
}