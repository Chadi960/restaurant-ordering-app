const Order = require('../models/order.model');
const OrderService = require('../services/order.service');

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({});
  res.status(200).json({
    data: orders
  });
}

exports.addOrder = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    const newOrder = await OrderService(req.body, user);
    res.status(200).json({
      data: newOrder,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await Order.findByIdAndUpdate(orderId, req.body);
    const updatedOrder = await Order.findById(orderId);
    res.status(200).json({
      data: updatedOrder
    });
  } catch (error) {
    next(error)
  }
}

exports.cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    await Order.findByIdAndDelete(orderId, (error, res) => {
      if (error) {
        res.status(500).json({
          error: error
        });
      }
    });

    res.status(200).json({
      data: orderId
    });
  } catch (error) {
    next(error)
  }
}
