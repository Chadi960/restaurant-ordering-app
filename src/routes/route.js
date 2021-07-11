const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/users', authMiddleware.allowIfLoggedIn, userController.getUsers);
router.post('/refresh-token', authMiddleware.refreshToken);
router.get('/user/:userId', userController.getUser);
router.delete('/user/logout', authMiddleware.logout);

module.exports = router;
