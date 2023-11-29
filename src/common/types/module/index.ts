import { MongoClient } from 'mongodb';
import { IModule } from '../../interfaces/module.interface';

export type ModuleConstructor = new (dbClient: MongoClient, dbName: string) => IModule;
export type AnyClass = new (...args: any[]) => any;