CarteX
projet final de l'UE dev web

- wOlwin: Teo Bacher
- Redes19: Loris Laurenti

Pour se connecté en tant qu'admin:
teo@teo.com
Azertyu1
Nous avons deux bases de données pour plus de sécurité : si l'une tombe, l'autre n'est pas affectée.

- Une BDD pour les cartes
- Une BDD pour les utilisateurs

Nous avons décidé de donner l'accès à notre .env, permettant l'accès au serveur de bases de données en ligne de Téo BACHER (évitant ainsi de devoir créer les bases de données).

Lancer le projet :
- git clone
- npm install
- npm start
- nodemon ./server.js à lancer dans le dossier /src/Back/API/
- Récupérer les bases de données : DB-PHPUNIT-USER.sql et DB-PHPUNIT.sql

Ligne de commande

Pour le back js :
- npm install express --save
- npm install dotenv
- npm install cors
- npm install mariadb
- npm install bcrypt
- npm install jsonwebtoken

Pour le php :
- composer require --dev phpunit/phpunit


Niveau front :
- npm install react-router-dom
- npm install axios
- npm install react-slick --save
- npm install slick-carousel --save

style :
- npm install @mui/material @emotion/react @emotion/styled
- npm install @mui/icons-material

Lancer le server js
- nodemon server.js

Lancer server php:
- php -S localhost:8000

Dans le .env il faudras rajouter cette ligne. Elle sert a decoder les token.
JWT_SECRET_KEY="QR)V!6;3gwhnW9vk%76G2?X7="




