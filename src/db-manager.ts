
import { MongoClient, ServerApiVersion } from 'mongodb';
import { CONSOLE_GREEN_BD, CONSOLE_RED_BD } from './common/const';

export class DatabaseManager {
  private client: MongoClient;

  constructor(uri: string) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log(CONSOLE_GREEN_BD, "Successfully DB connected!");
    } catch (error) {
      console.error(CONSOLE_RED_BD, "Failed to DB connect", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log("Disconnected from DB");
    } catch (error) {
      console.error("Failed to disconnect DB", error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }
}
