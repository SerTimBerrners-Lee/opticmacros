import express, { Application } from 'express';
import { DatabaseManager } from './db-manager';
import { CONSOLE_BOLD, CONSOLE_GREEN_BD, CONSOLE_RED_BD } from './common/const';
import { ModuleConstructor } from './common/types/module';
import { authMiddleware } from './common/middleware/auth.middleware';

export class App {
  private app: Application;
  private moduleClasses: Array<ModuleConstructor>;
  private dbManager: DatabaseManager;

  constructor(moduleClasses: Array<ModuleConstructor>, dbUri: string) {
    this.app = express();
    this.moduleClasses = moduleClasses;
    this.dbManager = new DatabaseManager(dbUri);

    this.init();
  }

  private async init() {
    try {
      console.log(CONSOLE_BOLD, `> Connected to database...`);
      await this.dbManager.connect();
      this.setConfig();
      
      console.log(CONSOLE_BOLD, `> Initialize controllers`);
      this.setControllers();

      this.start();
    } catch (err) {
      console.error(CONSOLE_RED_BD, "Faied to initialize the application", err);
    }
  }

  private setConfig() {
    this.app.use(express.json());
    this.app.use(authMiddleware(['/api/login', '/api/register']));
  }

  private setControllers() {
   for (const ModuleClasses of this.moduleClasses) {
    const module = new ModuleClasses(this.dbManager.getClient(), 'opticmacros'); 
    module.registerRouters(this.app);
   }
  }

  private start() {
    const port = process.env.PORT || 5001;
    this.app.listen(port, () => {
      console.log(CONSOLE_GREEN_BD, `\nServer is running on http://localhost:${port}`);
    });
  }

  public async close() {
    await this.dbManager.disconnect();
  }
}