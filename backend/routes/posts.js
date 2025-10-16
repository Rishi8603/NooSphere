const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { toggleLike, getLikeMeta, addComment, getComments, deleteComment } = require('../controllers/postController');

const { createPost, getPosts, deletePost,updatePost, getPostsByUser } = require('../controllers/postController'); // We will create this next

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.delete('/:id',authMiddleware,deletePost);
router.put('/:id',authMiddleware,updatePost);
router.get('/user/:userId', getPostsByUser);
router.post('/:postId/like', authMiddleware, toggleLike);
router.get('/:postId/likes/meta', authMiddleware, getLikeMeta);
router.post('/:postId/comment', authMiddleware, addComment);
router.get('/:postId/comment', authMiddleware, getComments);
router.delete('/:postId/comment/:commentId', authMiddleware, deleteComment);

module.exports = router;