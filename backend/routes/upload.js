const express=require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController'); 
const authMiddleware = require('../middleware/authMiddleware');
const upload=require('../middleware/multer');

// ROUTE: Handle file uploads using: POST "/api/upload". Login required.
router.post('/', authMiddleware,upload.single('file'), uploadController.uploadFile);

module.exports = router;