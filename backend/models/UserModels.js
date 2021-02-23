const connectdb = require('../connectdb.js');
const db =require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserModels {
    constructor() {
    }

    //Modèle s'inscrire
    signup(sqlInserts){
        let sql = 'INSERT INTO users VALUES(NULL, ?, ?, ?, ?, NULL)';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql, function(err, result){
                if (err) reject({error : 'Erreur dans l\'inscription'});
                resolve({message : 'Nouvel utilisateur !'})
            })
        })
    }

    //Modèle se connecter
    login(sqlInserts, password){
        let sql = 'SELECT * FROM users WHERE email = ?';
        sql = mysql.format(sql, sqlInserts);
        
                return new Promise((resolve, reject) =>{
            connectdb.query(sql, function(err, result, field){
              console.log(err);
                if (err) reject({ err });
                if (!result[0]){
                    reject ({ error : 'Utilisateur introuvable !'});
                } else {
                    bcrypt.compare(password, result[0].password) 
                        .then(valid => { 
                            if (!valid) return reject({ error: 'Mot de passe incorrect !' });
                            resolve({
                                userId: result[0].id,
                                token: jwt.sign(
                                    { userId: result[0].id,
                                    moderation: result[0].moderation },
                                    process.env.TOKEN,
                                    { expiresIn: '24h' } 
                                ),
                                moderation: result[0].moderation
                            });
                        })
                        .catch(error => reject({ error }));
                }
            })
        
        })
    }

    //Modèle voir compte
    seeMyProfile(sqlInserts){
        let sql = 'SELECT firstName, lastName, email FROM users WHERE id = ?';
        sql = mysql.format(sql,sqlInserts);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql, function(err, result){
                if (err) return reject({error : 'page indisponible'});
                resolve(result);
            }) 

        })
    
    }

    //Modèle modifier compte
    updateUser(sqlInserts){
        let sql = 'UPDATE users SET email = ?, firstName = ?, lastName = ? WHERE id = ?';
        sql = mysql.format(sql,sqlInserts);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql, function(err, result){
                if (err) return reject({error : 'fonction indisponible'});
                resolve({message : 'Informations mises à jour !'});
            }) 

        })
    }

    //Modèle supprimer compte
    deleteUser(sqlInserts){
        let sql = 'DELETE FROM users WHERE id = ?'; 
        sql = mysql.format(sql,sqlInserts);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql, function(err, result){
                if (err) return reject({error : 'fonction indisponible'});
                resolve({message : 'Utilisateur supprimé'});
            }) 

        })
    
    }
}

module.exports = UserModels;