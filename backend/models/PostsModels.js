const connectdb = require('../connectdb.js');
const mysql = require('mysql');

class PostsModels {
    constructor() {
    }
    
    //Modèle afficher les posts
    getAllPosts(){
        let sql = "SELECT posts.id, posts.userId, posts.title, posts.content, posts.imgUrl, DATE_FORMAT(DATE(posts.date), '%d/%m/%Y') AS date, TIME(posts.date) AS time, users.lastName, users.firstName, comments.postId, comments.comContent, comments.userId, DATE_FORMAT(DATE(comments.date), '%d/%m/%Y') FROM posts LEFT JOIN users ON posts.userId = users.id LEFT JOIN comments ON posts.id = comments.postId ORDER BY posts.date DESC";
        return new Promise((resolve) =>{
            connectdb.query(sql, function (err, result, fields) {
                if (err) throw err;
                resolve(result)
            });
        })
    }

    //Modèle créer post
    createPost(sqlInserts){
        let sql = 'INSERT INTO posts SET title= ?, content= ?, imgUrl= ?, userId= ?, date= NOW()';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql, sqlInserts, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            })       
        })
    }

    //Modèle modifier post
    updatePost(sqlInserts1, sqlInserts2){
        let sql1 = 'SELECT * FROM posts where id = ?';
        sql1 = mysql.format(sql1, sqlInserts1);
        return new Promise((resolve) =>{
            connectdb.query(sql1, function (err, result, fields){
                if (err) throw err;
                if(sqlInserts2[3] == result[0].userId){
                    let sql2 = 'UPDATE posts SET title = ?, content = ? WHERE id = ? AND userId = ?';
                    sql2 = mysql.format(sql2, sqlInserts2);
                    connectdb.query(sql2, function (err, result, fields){
                        if (err) throw err;
                        resolve({message : 'Post modifié !'});
                    })
                }else{
                    reject({error: 'fonction indisponible'});
                }
            })
        });
    }

    //Modèle supprimer post
    deletePost(sqlInserts1, sqlInserts2){
        let sql1 = 'SELECT * FROM posts where id = ?';
        sql1 = mysql.format(sql1, sqlInserts1);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql1, function (err, result, fields){
                if (err) throw err;
                if(sqlInserts2[1] == result[0].userId){
                    let sql2 = 'DELETE FROM posts WHERE id = ? AND userId = ?';
                    sql2 = mysql.format(sql2, sqlInserts2);
                    connectdb.query(sql2, function (err, result, fields){
                        if (err) throw err;
                        resolve({message : 'Post supprimé !'});
                    })
                }else{
                    reject({error: 'fonction indisponible'});
                }
            
            });
        })
    }

    //Modèle afficher les commentaires
    getComments(sqlInserts){
        let sql = "SELECT comments.id, comments.comContent, comments.userId, DATE_FORMAT(DATE(comments.date), '%d/%m/%Y') AS date, TIME(comments.date) AS time, users.firstName, users.lastName FROM comments JOIN users ON comments.userId = users.id WHERE comments.postId = ?";
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve) =>{
            connectdb.query(sql, function (err, result, fields){
                if (err) throw err;
                resolve(result);
            })
        
        })
    }

    //Modèle créer commentaire
    createComment(sqlInserts){
        let sql = 'INSERT INTO comments SET postId = ?, comContent = ?, userId = ?, date = NOW()';
        sql = mysql.format(sql, sqlInserts);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql, sqlInserts, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
                console.log(err);
            })       
        })
    }
    
    //Modèle supprimer commentaire
    deleteComment(sqlInserts1, userId){
        let sql1 = 'SELECT * FROM comments where id = ?';
        sql1 = mysql.format(sql1, sqlInserts1);
        return new Promise((resolve, reject) =>{
            connectdb.query(sql1, function (err, result, fields){
                if (err) throw err;
                if(userId == result[0].userId){
                    let sql2 = 'DELETE FROM comments WHERE id = ? AND userId = ?';
                    sql2 = mysql.format(sql2, [sqlInserts1[0], userId]);
                    connectdb.query(sql2, function (err, result, fields){
                        if (err) throw err;
                        resolve({message : 'Commentaire supprimé !'});
                    })
                }else{
                    reject({error: 'fonction indisponible'});
                }
            
            });
        })
    }
};

module.exports = PostsModels;