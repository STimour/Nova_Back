"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./configDB/db"));
const main_routes_1 = __importDefault(require("./routes/main.routes"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_middlewares_1 = require("./middlwares/errorHandler.middlewares");
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
class App {
    constructor(port, _userController = new user_controller_1.default()) {
        this.app = (0, express_1.default)();
        this.port = port;
        this._userController = _userController;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDatabaseConnection();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
    }
    initializeRoutes() {
        // Préfixe pour toutes les routes de l'API
        this.app.use('/api', main_routes_1.default);
        // Middleware global pour gérer les erreurs
        this.app.use(errorHandler_middlewares_1.errorHandler);
    }
    initializeDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.default.authenticate();
                console.log('Database connection has been established successfully.'); // Utiliser { alter: true } ou { force: true } uniquement en développement
                yield db_1.default.sync({ force: true }); // En développement, pour aider à synchroniser le schéma. Pour la production, utilisez des migrations.
                console.log('Database synced');
            }
            catch (error) {
                console.error('Unable to connect to the database or sync:', error);
                process.exit(1); // Quitter l'application si la connexion échoue
            }
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
