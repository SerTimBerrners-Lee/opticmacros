import { IsNumber, IsString } from "class-validator";

export class UpdateCarDto {
	@IsString()
	readonly brand: string;
	
	@IsString()
	readonly model: string;
	
	@IsNumber()
	readonly year: 	number;
	
	@IsNumber()
	readonly price: number;
}