'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const db_1 = __importDefault(require('./config/db'));
const index_routes_1 = __importDefault(require('./routes/index.routes'));
const cors_1 = __importDefault(require('cors'));
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeDatabaseConnection();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
        // Ajouter d'autres middlewares (morgan, helmet, etc.)
    }
    initializeRoutes() {
        this.app.get('/', (req, res) => {
            res.send('Hello, SkillUp API!');
        });
        this.app.use('/api', index_routes_1.default); // Préfixe pour toutes les routes de l'API
    }
    initializeDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.default.authenticate();
                console.log('Database connection has been established successfully.');
                yield db_1.default.sync(); // Utiliser { force: true } uniquement en développement pour recréer les tables
                console.log('Database synced');
            } catch (error) {
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
