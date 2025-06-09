import express, { Application, Request, Response } from 'express';
import sequelize from './configDB/db';
import MainRouter from './routes/main.routes';

import cors from 'cors';
import { errorHandler } from './middlwares/errorHandler.middlewares';

class App {
    public app: Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDatabaseConnection();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        // Ajouter d'autres middlewares (morgan, helmet, etc.)
    }

    private initializeRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Hello, SkillUp API!');
        });
        this.app.use('/api', MainRouter); // Préfixe pour toutes les routes de l'API
        // Middleware global pour gérer les erreurs
        this.app.use(errorHandler);
    }

    private async initializeDatabaseConnection(): Promise<void> {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            await sequelize.sync(); // Utiliser { force: true } uniquement en développement pour recréer les tables
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
