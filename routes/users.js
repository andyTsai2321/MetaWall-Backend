var express = require('express');
var router = express.Router();
const UserController = require('../controllers/user');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');

router.get('/', handleErrorAsync(UserController.getUsers));
router.post('/sign_up', handleErrorAsync(UserController.register));
router.post('/sign_in', handleErrorAsync(UserController.signIn));
router.get('/profile', isAuth, handleErrorAsync(UserController.profile));
router.post('/updatePassword', isAuth, handleErrorAsync(UserController.updatePassword));

module.exports = router;
