const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.allowIfLoggedIn = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

exports.verifyToken = async (req, res, next) => {
  if (req.headers["x-access-token"]) {
   const accessToken = req.headers["x-access-token"];

  try {
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
    }

    res.locals.loggedInUser = await User.findById(userId); next();
  } catch (error) {
     next(error);
    }
  } else {
    next();
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const accessToken = this.generateAccessToken({ _id: user.userId });
      await User.findByIdAndUpdate(user.userId, { accessToken });
      res.json({ accessToken: accessToken });
    })
  } catch (error) {
    next(error);
  }
}

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      await User.findByIdAndUpdate(user.userId, { refreshToken: null, accessToken: null });
      res.json({ message: "Logged out successfully" });
    })
  } catch (error) {
    next(error);
  }
}

exports.generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: 60
  });
}

exports.generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: 120
  });
}
