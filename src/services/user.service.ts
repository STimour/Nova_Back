import { UserRepository } from './../repositories/user.repository';
// src/services/userService.ts
import { User } from '../models/User.model';

// Importez d'autres modèles ou repositories si nécessaire
// import { Reputation } from '../models/Reputation.model';
// import { UnitOfWork } from '../utils/unitOfWork'; // Supposons que vous ayez un UoW

class UserService {
    // constructor(private uow: UnitOfWork) {} // Injectez le UoW si nécessaire
    private readonly _userRepository;

    constructor() {
        this._userRepository = new UserRepository();
    }



    public async getAllHelpers() {
        // Logique métier pour récupérer les helpers
        return User.findAll({
            where: {
                role: 'helper',
                deleted: false
            }
            // Inclure d'autres modèles si nécessaire, par exemple Reputation
            // include: [{ model: Reputation, as: 'reputation' }]
        });
    }

    public async createUser(userData: any) {
        // Logique métier complexe pour la création
        // await this.uow.startTransaction(); // Démarre la transaction si nécessaire
        try {
            // 1. Validation des données (peut être ici ou avant d'appeler le service)
            // 2. Hasher le mot de passe (exemple)
            // userData.password = await hashPassword(userData.password);

            const newUser = await User.create(userData);

            // 3. Créer des entités liées (exemple)
            // await Reputation.create({ idUser: newUser.id, score: 0 });

            // await this.uow.commit(); // Commit la transaction
            return newUser;
        } catch (error) {
            // await this.uow.rollback(); // Rollback en cas d'erreur
            throw error; // Relance l'erreur pour que le contrôleur la gère
        }
    }

    public async deleteUser(id: number, isDelete: boolean) {
        // Logique métier pour récupérer un utilisateur par son ID
        const user = await U
    }



    // ... autres méthodes (getUserById, updateUser, deleteUser avec logique métier)
}

export default new UserService(); // Ou injectez les dépendances si vous utilisez un conteneur d'injection
