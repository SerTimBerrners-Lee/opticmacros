import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Response, response } from 'express';

describe('CarsService', () => {
  let mongod: MongoMemoryServer;
  let client: MongoClient;
  let db;
  let carsService: CarsService;

  const mockResponse = (): Response => {
    const res = response;
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    carsService = new CarsService(client, db.databaseName);
  });

  afterAll(async () => {
    await client.close();
    await mongod.stop();
  });

  // Testing for Create
  it('Create a new car', async () => {
    const createCarDto: CreateCarDto = {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      price: 20000,
    };

    const res: Response = mockResponse();

    await carsService.create(createCarDto, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      brand: createCarDto.brand,
      model: createCarDto.model,
      year: createCarDto.year,
      price: createCarDto.price
    }));
  });

  // Testing for update
  it('Update a car', async () => {
    const res: Response = mockResponse();

    const car = await carsService.create({ brand: 'Test', model: 'Model', year: 2020, price: 30000 }, res);
    const carId = (car.json as jest.Mock).mock.calls[0][0]._id;

    const updateDto = { brand: 'Updated', model: 'UpdatedModel', year: 2021, price: 35000 };
    await carsService.update(updateDto, carId, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(updateDto));
  });

  // Testing for delete
  it('Delete a car', async () => {

    const res: Response = mockResponse();

    const car = await carsService.create({ brand: 'Test', model: 'Model', year: 2020, price: 30000 }, res);
    const carId = (car.json as jest.Mock).mock.calls[0][0]._id;

    // Delete the car
    await carsService.delete(carId, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });

  // Testing for sorting
  it('Retrieve all cars sorted by brand', async () => {
    
    const res: Response = mockResponse();

    await carsService.create({ brand: 'BrandA', model: 'ModelA', year: 2019, price: 20000 }, res);
    await carsService.create({ brand: 'BrandB', model: 'ModelB', year: 2020, price: 25000 }, res);
    await carsService.create({ brand: 'BrandC', model: 'ModelC', year: 2021, price: 30000 }, res);
    
    // Retrieve and check sorting
    await carsService.getAllSortedByBrand(res);
    
    expect(res.status).toHaveBeenCalledWith(201);

    const calls = (res.json as jest.Mock).mock.calls;
    const sortedCars: any = [];

    for (let i = 0; i < 3; i++) {
      sortedCars.push(calls[i][0]);
    }

    expect(sortedCars.length).toBeGreaterThanOrEqual(3);
    expect(sortedCars[0].brand).toBe('BrandA');
    expect(sortedCars[1].brand).toBe('BrandB');
    expect(sortedCars[2].brand).toBe('BrandC');
  });

});
