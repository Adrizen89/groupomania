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

    
    router.get('/likes', auth, postsCtrl.getAllLikes);
    router.post('/:id/like', auth, postsCtrl.postLike);

    

}catch (error){
    console.log(error);
} 

module.exports = router;




