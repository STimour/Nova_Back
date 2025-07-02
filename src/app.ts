import express, { Application, Request, Response } from 'express';
import sequelize from './configDB/db';
import MainRouter from './routes/main.routes';
import cors from 'cors';
import { errorHandler } from './middlwares/errorHandler.middlewares';
import UserController from './controllers/user.controller';

class App {
    public app: Application;
    public port: number;

    private _userController: UserController;

    constructor(port: number, _userController = new UserController()) {
        this.app = express();
        this.port = port;
        this._userController = _userController;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDatabaseConnection();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    private initializeRoutes(): void {
        // Préfixe pour toutes les routes de l'API
        this.app.use('/api', MainRouter);

        // Middleware global pour gérer les erreurs
        this.app.use(errorHandler);
    }

    private async initializeDatabaseConnection(): Promise<void> {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.'); // Utiliser { alter: true } ou { force: true } uniquement en développement
            await sequelize.sync({ force: true }); // En développement, pour aider à synchroniser le schéma. Pour la production, utilisez des migrations.
            console.log('Database synced');
        } catch (error) {
            console.error('Unable to connect to the database or sync:', error);
            process.exit(1); // Quitter l'application si la connexion échoue
        }
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        });
    }
}

export default App;
