const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const addressController = require('../controllers/address.controller');
const branchController = require('../controllers/branch.controller');
const categoryController = require('../controllers/category.controller');
const itemController = require('../controllers/item.controller');
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

// branch
router.post(
  '/add-branch',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'branch'),
  branchController.addBranch
);
router.get(
  '/branches',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('readAny', 'branch'),
  branchController.getBranches,
);
router.put(
  '/update-branch/:branchId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'branch'),
  branchController.updateBranch
);
router.delete(
  '/delete-branch/:branchId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('deleteAny', 'branch'),
  branchController.deleteBranch
)

// category
router.post(
  '/add-category',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'category'),
  categoryController.addCategory
);
router.get(
  '/categories',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('readAny', 'category'),
  categoryController.getCategories,
);
router.put(
  '/update-category/:categoryId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'category'),
  categoryController.updateCategory
);
router.delete(
  '/delete-category/:categoryId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('deleteAny', 'category'),
  categoryController.deleteCategory
)

// item
router.post(
  '/add-item',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'item'),
  itemController.addItem
);
router.post(
  '/add-item-category/:itemId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'item'),
  itemController.addItemCategory
);
router.get(
  '/items',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('readAny', 'item'),
  itemController.getItems,
);
router.get(
  '/items:itemId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('readAny', 'item'),
  itemController.getItems,
);
router.put(
  '/update-item/:itemId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('updateAny', 'item'),
  itemController.updateItem
);
router.delete(
  '/delete-item/:itemId',
  authMiddleware.allowIfLoggedIn,
  userMiddleware.grantAccess('deleteAny', 'item'),
  itemController.deleteItem
)

module.exports = router;
