const express=require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController'); 
const authMiddleware = require('../middleware/authMiddleware');
const upload=require('../middleware/multer');

router.post('/', authMiddleware,upload.single('file'), uploadController.uploadFile);

module.exports = router;