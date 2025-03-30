# Utiliser une image Node.js comme base
FROM node:16

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port utilisé par le backend
EXPOSE 3001

# Démarrer l'application
CMD ["node", "index.js"]
