const express = require('express');
const router = express.Router();

const { summarizePost } = require('../controllers/aiController');

// POST /api/ai/summarize
router.post('/summarize', summarizePost);

module.exports = router;