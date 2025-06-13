import { Token } from '../../models/Token.model';

export interface IAuthRepository {
    /**
     * Crée et enregistre un nouveau token d'authentification pour un utilisateur.
     * @param newAuthToken Le token généré.
     * @param userId L'identifiant de l'utilisateur associé au token.
     * @param expiresAt Date d'expiration du token.
     * @returns Promise contenant le token créé ou undefined en cas d'échec.
     */
    createToken(newAuthToken: string, userId: number, expiresAt: Date): Promise<Token | undefined>;

    /**
     * Recherche un token d'authentification en base à partir de sa valeur.
     * @param tokenString Le token à rechercher.
     * @returns Promise contenant le token trouvé ou undefined si non trouvé.
     */
    findToken(tokenString: string): Promise<Token | undefined>;

    /**
     * Désactive (invalide) un token d'authentification.
     * @param tokenString Le token à désactiver.
     * @returns Promise indiquant si la désactivation a réussi.
     */
    desactivateAuthToken(tokenString: string): Promise<boolean>;
}
