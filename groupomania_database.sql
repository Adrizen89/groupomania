
DROP DATABASE IF EXISTS groupomania;
CREATE DATABASE IF NOT EXISTS groupomania;
USE groupomania;

SET NAMES utf8;

/*Reset rapide en cas d'erreur*/
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;

/*Création de la table des utilisateurs, avec id, pseudo, mail, password, nom et prénom */
CREATE TABLE users (
    id INT UNSIGNED NOT NULL  AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    moderation INT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB ;


/*Création de la table des articles postés, avec id, titre, description, sujet (pour classement des posts), auteur, date du post, et éventuellement photo de l'article */
CREATE TABLE posts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    content TEXT,
    imgUrl VARCHAR(200),
    userId INT UNSIGNED NOT NULL,
    date DATETIME NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB ;


/*Création de la table des commentaires, avec id, titre et description, article et auteur associés */
CREATE TABLE comments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    comContent VARCHAR(200) NOT NULL,
    userId INT UNSIGNED NOT NULL,
    postId INT UNSIGNED NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB ;
    
    
ALTER TABLE posts ADD CONSTRAINT fk_usersId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comments ADD CONSTRAINT fk_comments_postId FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comments ADD CONSTRAINT fk_comments_userId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;