const { roles } = require('../roles');
const Order = require('../models/order.model');

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const user = res.locals.loggedInUser;
      const permission = roles.can(user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.updateValidation = async (req, res, next) => {
  if (req.body.role === 'user' && req.body.email) {
    return res.status(401).json({
      error: "User not allowed to update email"
    });
  }

  if (req.body.isActivated && req.body.role === 'user') {
    return res.status(401).json({
      error: "User not allowed to change activation status"
    });
  }
  next();
}

exports.orderValidation =  async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (req.body.status === 'accept' && user.role !== 'admin') {
      return res.status(401).json({
        error: "Only admin can accept orders"
      });
    }
    next();
  } catch(error) {
    next(error)
  }
}

exports.orderCancelValidation = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (user.role === 'user') {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);

      if (order.status !== "pending") {
        return res.status(401).json({
          error: "You can only cancel pending orders"
        });
      }
    } next();
  } catch(error) {
    next(error)
  }
}
