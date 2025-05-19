Le choix de la problematique ainsi que le nombre d'apprenant par projet reste au choix des apprenants, cependant par soucis d'équité, une discussion préalable a été menée afin de s'accorder sur un rendu aux quantitativement fixé a l'amiable entre les apprenants de chaque groupe et le formateur
De manière générale, l'application ne peut pas implémenter que des fonctionnalitées endémiques à un CRUD (elle doit implémenter au moins 3 mécaniques customisées telle que : du Scraping automatisé avec un CRON

10 points sont distribués pour l'ensemble des points suivants:
L'ensemble de l'application Back doit etre développée dans un langage libre dans le panel de technologies que je maitrise (PHP, GoLang, Python, C, C++, C#) et répondre aux normes de code quality (PSR vu en cours ) et implémenter au minimum les fonctionnalités vues en cours soit :

- Repondre aux 5 contraintes Obligatoires d'une API REST (vue en cours l'année derniere et poussées cette année avec des prerogatives de code quality
- L'application Back doit Implementation du cache
- L'application Back doit avoir au moins un Middleware (utile pour la gestion d'erreur par exemple )
- L'application Back doit distribuer des Routes d'une API avec un systeme d'utilisateur, de roles, et d'enregistrement de fichier au minimum
- L'application Back doit s'élever au niveau 4 de l'echelle de Richardson
- L'application Back doit etre prete a implémenter l'historisation, l'anonymisation des utilisateurs et un gestion (légère) des statistiques.
- L'application Back doit etre documentée au mieux (installation du projet, fonctionnalitées de l'application)
- L'application doit au minimum contenir une page répondant au design pattern MVC (panel d'administration par exemple)

L'application doit être accompagnée d'un Front :

- L'application front doit répondre a un design pattern cohérent ( atomic design vu en cours )
- L'application front doit répondre aux normes Google d'une PWA (gestion du cache et du Offline, installation depuis le navigateur au minimum)
- L'application front doit bien entendue être connectée au BACK
- L'application front doit implémenter l'ensemble des Hooks vus en cours sauf le useRef et le useCallBack qui ne sont pas essentiels a chaque besoin (useContext, useState, useEffect)
- L'application front doit avoir un système de Theme et être prête a changer de renderer (de React Js a React native ou inversement ) en changeant au maximum l'ensemble des atoms pours les utilisateurs du atomic design, tout pratiquant d'un autre design pattern se verra dans l'obligation d'expliquer, ainsi que de fournir une procédure afin d'effectuer le virage technologique sus-mentionné.
- l'application front doit implémenter un système de "Night Mode" (implémenté en cours)
- L'application doit etre résponsive (dans la limite du raisonnable)
- L'application doit etre utilisable sur les navigateurs de nouvelle génération et sur Chrome (navigateur le plus utilisé par les clients)

Le reste de la note se voit attribué sur la qualité de code, la pertinence des commit & commentaires, l'implication dans le projet (si l'apprenant est en groupe)

Un bonus de 0 à 2 point peut etre attribué pour l'utilisation ingénieuse d'une technologie pertinente par rapport a la problématique : (un ERP qui utiliserai electron par exemple)
Un bonus de 1 point peut etre attribué en fonction d'un comportement exemplaire (entraide d'un élève plus éxperimenté a un élève plus en difficulté par exemple ) ou d'une remarque très pertinente en cours

AUCUN bonus ne sont attribués quant au choix de la problématique aussi compliquée soit-elle ou à l'esthétique de l'application
AUCUN bonus ou malus ne sont attribués quant à la discipline de l'apprenant (si ce ne sont les points sus-mentionnés), ou son comportement vis a vis du formateur

Voici la liste des contraintes éliminatoires :
L'application n'est pas accessible publiquement (l'utilisation de gitHub est fortement conseillé)
L'application n'a pas de jeu de donnée de test pret a l'emploi (Fixture ou autre )
L'application n'a pas de procédure d'installation
La procédure d'installation de l'application ne marche pas sur l'ensemble de mes systemes d'exploitation : Linux, Windows, MacOS
