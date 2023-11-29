import { ObjectId } from "mongodb";

export interface ICar {
	_id: 		ObjectId;
	brand: 	string;
	model: 	string;
	year: 	number;
	price:  number;
}