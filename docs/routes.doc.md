# Toutes les routes de l'api commence par

**Auth Routes**
| Méthode | Route | Description |
|---------|-----------------|------------------------------------|
| POST | /api/auth/login | Authentifier un utilisateur |
| POST | /api/auth/register | Enregistrer un nouvel utilisateur |
| POST | /api/auth/logout | Déconnecter un utilisateur |

**User Routes**

| Méthode | Route                  | Description                      |
| ------- | ---------------------- | -------------------------------- |
| GET     | /api/user/             | Récupérer tous les utilisateurs  |
| GET     | /api/user/helpers      | Récupérer tous les helpers       |
| GET     | /api/user/helpers/:id  | Récupérer un helper par son ID   |
| GET     | /api/user/students     | Récupérer tous les étudiants     |
| GET     | /api/user/students/:id | Récupérer un étudiant par son ID |

**Session Routes**
| Méthode | Route | Description |
|---------|------------------------|---------------------------------------------|
| POST | /api/session/all | Récupérer toutes les sessions d'un utilisateur |
| POST | /api/session/:id | Suppression logique (soft delete) d'une session |
| PATCH | /api/session/:id | Mettre à jour une session |
| GET | /api/session/:id | Récupérer une session par son ID |
