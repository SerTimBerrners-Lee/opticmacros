import { CarsController } from "./cars.controller";
import { CarsService } from "./cars.service";
import { IModule } from '../common/interfaces/module.interface';
import { Application } from "express";
import { MongoClient } from "mongodb";
import { validateDTO } from "../common/middleware/validate-dto.middleware";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";

export class CarsModule implements IModule {
	public service: CarsService;
	public controller: CarsController;

	constructor(dbClient: MongoClient, dbName: string) {
		this.service = new CarsService(dbClient, dbName);
		this.controller = new CarsController(this.service);
	}

	registerRouters(app: Application): void {
		app.get('/api/cars', this.controller.getAllSortedByBrand);
		app.post('/api/cars', validateDTO(CreateCarDto), this.controller.create);
		app.put('/api/cars/:id', validateDTO(UpdateCarDto), this.controller.update);
		app.delete('/api/cars/:id', this.controller.delete);
	}
}