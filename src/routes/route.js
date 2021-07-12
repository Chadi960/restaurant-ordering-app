const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const addressController = require('../controllers/address.controller');
const authMiddleware = require('../middleware/auth.middleware');
const userMiddleware = require('../middleware/user.middleware');

// auth
router.get('/users', authMiddleware.allowIfLoggedIn, userController.getUsers);
router.post('/refresh-token', authMiddleware.refreshToken);
router.delete('/user/logout', authMiddleware.logout);

// user
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get(
  '/user',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('readOwn', 'profile'),
  userController.getUser
);
router.get(
  '/user/:userId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('readAny', 'profile'),
  userController.getUser
);
router.put(
  '/user/:userId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'profile'),
  userController.updateUser
);
router.put(
  '/user/:userId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateOwn', 'profile'),
  userController.updateUser
);

// address
router.post(
  '/add-address',
  authMiddleware.allowIfLoggedIn,
  addressController.addUserAddress
);
router.get(
  '/my-addresses',
  authMiddleware.allowIfLoggedIn,
  addressController.getUserAddresses
);
router.put(
  '/update-address/:addressId',
  authMiddleware.allowIfLoggedIn,
  addressController.updateAddress
);
router.delete(
  '/delete-address/:addressId',
  authMiddleware.allowIfLoggedIn,
  addressController.deleteAddress
)
module.exports = router;
