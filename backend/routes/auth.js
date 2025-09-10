const { signup, login } = require('../controllers/authController');
router.post('/signup', signup);
router.post('/login', login);