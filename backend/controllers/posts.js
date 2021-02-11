const connectdb = require('../connectdb.js');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const PostsModels = require ('../Models/PostsModels.js');
const multer = require ('../middleware/multer-config');
const base64ImageToFile = require('base64image-to-file');

let postsModels = new PostsModels();


exports.getAllPosts = (req, res, next) => {
    postsModels.getAllPosts()
        .then((response) => {
            res.status(200).json(JSON.stringify(response));
        });
}
exports.createPost = (req, res, next) => { 
    let title = req.body.title;
    let userId = req.body.userId;
    let content = req.body.content; 
    let imgUrl = '';
    
    if (req.file){
        imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        } else {
            imgUrl='';
        }
        let sqlInserts = [title, content, imgUrl, userId];
    postsModels.createPost(sqlInserts)
        .then(sqlInserts => {
            res.status(201).send({message : 'post créé'});
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({
                message : err.message || "une erreur est survenue lors de la creation du post !"
            });
        });
    
    
}
exports.updatePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let title = req.body.title;
    let content = req.body.content;
    let postId = req.params.id;
    let sqlInserts1 = [postId];
    let sqlInserts2 = [title, content, postId, userId];

    postsModels.updatePost(sqlInserts1, sqlInserts2)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}
exports.deletePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let postId = req.params.id;
    let sqlInserts1 = [postId];
    let sqlInserts2 = [postId, userId];
    postsModels.deletePost(sqlInserts1, sqlInserts2)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response));
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}


exports.getComments = (req, res, next) => {
    let postId = req.params.id;
    let sqlInserts = [postId];
    postsModels.getComments(sqlInserts)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response));
        })
}
exports.createComment = (req, res, next) => { 
    let postId = req.params.id;
    let userId = req.body.userId;
    let comContent = req.body.comContent;
    let sqlInserts = [postId, comContent, userId];
    postsModels.createComment(sqlInserts)
        .then((response) =>{
            res.status(201).json(JSON.stringify(response));
        })
}
exports.updateComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    let content = req.body.comContent;
    let commentId = req.params.id;
    let sqlInserts1 = [commentId];
    let sqlInserts2 = [content, commentId, userId];
    postsModels.updatePost(sqlInserts1, sqlInserts2)
        .then((response) => {
            res.status(201).json(JSON.stringify(response));
        })
        .catch((error) =>{
            console.log(error);
            res.status(400).json(JSON.stringify(error));
        })
}
exports.deleteComment = (req, res, next) => {
    let commentId = req.params.id;
    let sqlInserts = [commentId];
    postsModels.deleteComment(sqlInserts, req.body.userId)
        .then((response) =>{
            res.status(200).json(JSON.stringify(response));
        })
}






