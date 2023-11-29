import { App } from "./app";
import { CarsModule } from "./cars/cars.module";
import { UsersModule } from "./users/usesr.module";
import 'reflect-metadata';

// Linked to mongoDB connection
const dbUri = 'mongodb+srv://root:root@root.ypfxxco.mongodb.net/?retryWrites=true&w=majority';

// initialize application
new App([
	CarsModule,
	UsersModule
], dbUri);