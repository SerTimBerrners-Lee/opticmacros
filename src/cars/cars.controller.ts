import { Request, Response } from 'express';
import { CarsService } from "./cars.service";
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

export class CarsController {
	constructor(private carsService: CarsService) {}

	create = async ({ body }, res: Response): Promise<Response> => {
		const dto: CreateCarDto = body;
		return await this.carsService.create(dto, res);
	}

	update = async ({ body, params }: Request, res: Response): Promise<Response> => {
		const dto: UpdateCarDto = body;
		const carId = params.id;

		return await this.carsService.update(dto, carId, res);
	}

	delete = async ({ params }: Request, res: Response): Promise<Response> => {
		const carId = params.id;

		return await this.carsService.delete(carId, res);
	}
	
	getAllSortedByBrand = async (req: Request, res: Response): Promise<Response> => {
		return await this.carsService.getAllSortedByBrand(res);
	}
}