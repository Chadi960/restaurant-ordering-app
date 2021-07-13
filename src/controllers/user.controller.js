const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/auth.middleware');

// it's better to move all business logic to a user service layer but decided to leave them here for now
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { email, fullName, password, role, } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, fullName, password: hashedPassword, role: role || "user" });
    const accessToken = authMiddleware.generateAccessToken(newUser);
    const refreshToken = authMiddleware.generateRefreshToken(newUser);
    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;
    await newUser.save();
    res.json({
      data: newUser,
      message: "You have signed up successfully"
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));
    if (!user.isActivated) {
      return res.status(401).json({
        error: "You're account is disabled"
      });
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password is not correct'));
    const accessToken = authMiddleware.generateAccessToken(user);
    const refreshToken = authMiddleware.generateRefreshToken(user);
    await User.findByIdAndUpdate(user._id, { accessToken: accessToken, refreshToken: refreshToken });
    res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken,
      refreshToken
    })
  } catch (error) {
    next(error);
  }
}

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
   data: users
  });
}

exports.getUser = async (req, res, next) => {
  try {
    const { email, fullName } = res.locals.loggedInUser;

    res.status(200).json({
      data: {
        "email": email,
        "fullName": fullName
      }
    });
  } catch (error) {
    next(error)
  }
}

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error('User does not exist'));
    res.status(200).json({
      data: {
        "email": user.email,
        "fullName": user.fullName
      }
    });
  } catch (error) {
    next(error)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, req.body);
    const user = await User.findById(userId)
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error)
  }
}
