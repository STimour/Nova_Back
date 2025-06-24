import { User } from '../../models/User.model';
import { IUser } from '../../models/interfaces/IUser';

export interface IUserRepository {
    /**
     * Récupère tous les utilisateurs.
     * @returns Promise contenant la liste des utilisateurs.
     */
    findAllUsers(): Promise<User[] | undefined>;

    /**
     * Récupère tous les utilisateurs ayant le rôle 'student'.
     * @returns Promise contenant la liste des étudiants.
     */
    findAllStudents(): Promise<User[] | undefined>;

    /**
     * Récupère tous les utilisateurs ayant le rôle 'helper'.
     * @returns Promise contenant la liste des helpers.
     */
    findAllHelpers(): Promise<User[] | undefined>;

    /**
     * Recherche un utilisateur par email, prénom et statut de suppression.
     * @param email Email de l'utilisateur.
     * @param firstname Prénom de l'utilisateur.
     * @param deleted Statut de suppression.
     * @returns Promise indiquant si l'utilsateur existe déjà ou pas.
     */
    isUserExists(email: string, firstname: string, deleted: boolean): Promise<boolean>;

    /**
     * Crée un nouvel utilisateur.
     * @param user Données du nouvel utilisateur.
     * @returns Promise indiquant si la création a réussi.
     */
    createUser(user: IUser): Promise<boolean>;

    /**
     * Recherche un utilisateur par son identifiant.
     * @param id Identifiant du helper.
     * @returns Promise contenant l'utilisateur trouvé ou null.
     */
    findHelper(id: number): Promise<User | undefined>;

    /**
     * Recherche un utilisateur par son identifiant.
     * @param id Identifiant du student.
     * @returns Promise contenant l'utilisateur trouvé ou null.
     */
    findStudent(id: number): Promise<User | undefined>;
}
