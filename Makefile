# Commande pour lancer le docker-compose en mode dev
dev:
	docker-compose -f docker-compose.dev.yml up

# Commande pour lancer en mode production
prod:
	docker-compose -f docker-compose.prod.yml up --build

# Commande pour arrêter les conteneurs
down:
	docker-compose -f docker-compose.dev.yml down

# Commande pour construire l'image sans lancer
build:
	docker-compose -f docker-compose.dev.yml build

# Commande pour initialiser les données
seed:	
	docker-compose exec nova-back-dev npm run seed

