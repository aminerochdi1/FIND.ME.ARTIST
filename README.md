<br/>
<br/>
Ce projet est une plateforme web qui permet de mettre en relation des artistes avec des recruteurs. Elle joue le rôle de réseau social pour les artistes. Ce projet a été réalisé lors d'une mission qui s'est déroulée de mai 2024 à septembre 2024. Comme je ne souhaite pas être le prestataire pour la maintenance, je rédige une documentation rapide.


## Langages de programmations et frameworks utilisés
<ul>
  <li>HTML, CSS</li>
  <li>TypeScript & JavaScript</li>
  <li>CKEditor</li>
  <li>Swiper</li>
  <li>Bootstrap 5</li>
  <li>NodeMailer</li>
  <li>Multer</li>
  <li>Sharp</li>
  <li>Stripe</li>
  <li>NextJS (ReactJS)</li>
  <li>Sequelize (ORM)</li>
</ul>

## Installation et démarrage

L'installation du projet nécessite plusieurs étapes. Tout d'abord, configurez Sequelize.

1. Ouvrez le fichier <code>config/models.json</code> et remplacez la valeur de <code>path</code> par le chemin d'accès à la racine de votre projet.

2. Ensuite, toujours dans le même dossier, définissez les paramètres de connexion à votre base de données dans le fichier <code>config.json</code>.

Une fois ces deux étapes terminées, vous pouvez créer la base de données et effectuer la migration.

<strong>Si vous n'avez pas le CLI de Sequelize, installez-le avec cette commande : <code>npm install -g sequelize-cli</code></strong>

1. Créez la base de données : <code>npx sequelize-cli db:create</code>

2. Effectuez la migration : <code>npx sequelize-cli db:migrate</code>
   <br><small>Lorsqu'il s'agit de l'environnement de production, ajoutez ce paramètre : <code>--env production</code></small>

### Environnement de développement
Notez que cette version utilise la base de données "development", pas celle de la version "production".

<u>Lancer le serveur web</u> : <code>npm run dev</code>

<u>Lancer le serveur de communication</u> : <code>npm run websocket</code>

### Environnement de production
<u>Construire le projet et démarrer le serveur web</u> : <code>npm run build && npm run start</code>

<u>Lancer le serveur de communication</u> : <code>npm run websocket_production</code>

## Travail à prévoir

Faut savoir que c'est une mise au point qui fait retour d'éléments qui n'était pas demandé lors de la demande du site. Le site internet, peut très fontionner comme il est actuellement, mais il pourrais être amélioré 

<pre style='color: white;'>
# Mise au point
  Sécurité:
  * Intégrer un système de whitelist pour les boite mails
  * Intégrer un système de limitation de requête à l'api (pour éviter les surcharge)
  * Intégrer un système de logs pour avoir un suivi de l'activité des utilisateurs sur la plateforme 
  * Implémenter un système de sauvegarde pour les images envoyer par les utilisateurs
  * Implémenter un système de sauvegarde pour la base de donnée
  * Intégrer un cota de message par heure
  * Intégrer un taille maximal des message à envoyer
  * Définir un cota maximum d'image des utilisateurs
  * Faire en sorte que l'utilisateur peut supprimer les informations lié à son compte.
  * Gérer les sessions de connexion d'un comptes

  Optimisation:
  * Intégration d'un système de cache qui pourrait permettre d'éviter de surcharger la base de données
  * Suppression des comptes non confirmé au bout d'une semaine de création (2)
  * Optimisation du site internet pour augmenter les performances de chargement

  Fonctionnalités:
  * Intégration de modification du mot de passe et pour modifier l'adresse email.
  * Intégration d'un formulaire de contact (avec différentes problèmes)
  * Intégration de plusieurs profiles pour un seul utilisateur 
  * Intégration d'un système de facturation pour les clients qui prenne un abonnement
</pre>

## Crédits

Développé par ROCHDI Mohammed Amine


<br><br>
