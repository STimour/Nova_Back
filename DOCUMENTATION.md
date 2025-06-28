# Documentation API

Toutes les routes sont préfixées par `/api`.  
Cette doc couvre les routes d'authentification, les utilisateurs (helpers/étudiants) et les sessions.

---

## Authentification (`/api/auth`)

Routes pour gérer la connexion et l'inscription des utilisateurs :

- `POST /auth/login` : connexion d’un utilisateur
- `POST /auth/logout` : déconnexion d’un utilisateur
- `POST /auth/inscription` : création d’un nouveau compte

---

## Utilisateurs (`/api/users`)

Routes pour accéder aux données des utilisateurs (helpers et étudiants).

### Helpers

- `GET /users/helpers` : récupère tous les helpers
- `GET /users/helpers/:id` : récupère les infos d’un helper par son ID
- `POST /users/helpers/:id` : supprime (soft delete) un helper

### Étudiants

- `GET /users/students` : récupère tous les étudiants
- `GET /users/students/:id` : récupère les infos d’un étudiant par son ID
- `POST /users/students/:id` : supprime (soft delete) un étudiant

---

## Sessions (`/api/session`)

Routes liées aux demandes de sessions entre étudiants et helpers.

- `POST /session/all` : récupère toutes les sessions d’un utilisateur
- `GET /session/:id` : récupère une session spécifique par ID
- `PATCH /session/:id` : met à jour une session
- `POST /session/:id` : supprime (soft delete) une session

Demandes de session :

- `POST /session/:id/request` : un étudiant envoie une demande à un helper
- `POST /session/:id/accept` : le helper accepte la demande
- `POST /session/:id/refuse` : le helper refuse la demande

---

## Remarques

- Les suppressions sont logiques (soft delete), donc les données restent en base.
