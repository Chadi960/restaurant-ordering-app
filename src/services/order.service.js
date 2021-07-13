const Order = require('../models/order.model');
const Branch = require('../models/branch.model');

exports.createOrder = async (orderDto, user) => {
  const { total, note, status } = orderDto;
  const branch = await getNearestBranch(user.currentAddress);
  const newOrder = new Order({ total, note, status, branch });
  await newOrder.save();
}

const getNearestBranch = async (userPoint) => {
  Branch.findOne({ $where: function() {
    return withinRadius(this.coordinates, userPoint, 5);
  }}, (err, doc) => {
    if (err) return err;
    return doc
  });
}

// Note: This function is copied from moshmage/withinRadius.js
const withinRadius = (point, interest, kms) => {
  'use strict';
  let R = 6371;
  let deg2rad = (n) => { return Math.tan(n * (Math.PI/180)) };

  let dLat = deg2rad(interest[0] - point[0] ); // 0 representing latitude in this case and 1 for longitude
  let dLon = deg2rad( interest[1] - point[1] );

  let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(point[0])) * Math.cos(deg2rad(interest[0])) * Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let d = R * c;

  return (d <= kms);
}
