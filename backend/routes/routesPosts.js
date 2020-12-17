const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postsCtrl = require('../controllers/posts');

try{
    router.get('/', auth, postsCtrl.getAllPosts);
    router.post('/', auth, multer, postsCtrl.createPost);
    router.put('/:id', auth, multer, postsCtrl.updatePost);
    router.delete('/:id', auth, postsCtrl.deletePost); 

    router.get('/:id/comments', auth, postsCtrl.getComments);
    router.post('/:id/comments', auth, postsCtrl.createComment);
    router.put('/comments/:id', auth, postsCtrl.updateComment);
    router.delete('/comments/:id', auth, postsCtrl.deleteComment);

    

}catch (error){
} 

module.exports = router;




