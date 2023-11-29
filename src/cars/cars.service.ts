import { UpdateCarDto } from "./dto/update-car.dto";
import { MongoClient, Collection, ObjectId } from "mongodb";
import { ICar } from "./interfaces/cat.interface";
import { CreateCarDto } from "./dto/create-car.dto";
import { Response } from 'express';

export class CarsService {
	private carsCollection: Collection<ICar | Omit<ICar, '_id'>>;

	constructor(dbClient: MongoClient, dbName: string) {
		this.carsCollection = dbClient.db(dbName).collection("cars");
	}

	async create(dto: CreateCarDto, res: Response): Promise<Response> {

		const result = await this.carsCollection.insertOne(dto);
		const newCar = await this.carsCollection.findOne({_id: result.insertedId});
		
		return res.status(201).json(newCar);
	}

	async update(dto: UpdateCarDto, carId: string, res: Response): Promise<Response> {
		try {
			if (!carId) {
				return res.status(400).send("Car ID is required");
			}

			const result = await this.carsCollection.findOneAndUpdate(
				{ _id: new ObjectId(carId) },
				{ $set: dto },
				{ returnDocument: 'after' }
			);

			if (!result) 
				return res.status(404).send("Car not found");
	
			return res.status(201).json(result) ;
		} catch (err) {
			console.error(err);
			return res.status(500).send(err.message);
		}
	}

	async delete(carId: string, res: Response): Promise<Response> {
		try {
			if (!carId) {
				return res.status(400).send("Car ID is required");
			}

			const result = await this.carsCollection.findOneAndDelete({ _id: new ObjectId(carId) });
			if (!result) {
				return res.status(404).send("Car not found")
			}

			return res.status(201).json(result);			
		} catch (err) {
			console.error(err);
			return res.status(500).send(err.message);
		}
	}

	async getAllSortedByBrand(res: Response): Promise<Response> {
		try {
			const cars = await this.carsCollection.find().sort({ brand: 1 }).toArray();

			return res.status(201).json(cars);
		} catch (err) {
			console.error(err);
			return res.status(500).send(err.message);
		}
	}
}
