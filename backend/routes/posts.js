const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { createPost, getPosts, deletePost } = require('../controllers/postController'); // We will create this next

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.delete('/:id',authMiddleware,deletePost);


module.exports = router;