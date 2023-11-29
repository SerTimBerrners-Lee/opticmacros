import { Application } from 'express';

export interface IModule {
	registerRouters(app: Application): void
}