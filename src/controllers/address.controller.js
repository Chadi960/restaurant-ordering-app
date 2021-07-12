const Address = require('../models/address.model');
const User = require('../models/user.model');

exports.getUserAddresses = async (req, res, next) => {
  const userAddresses = await User.findById(res.locals.loggedInUser._id).populate("addresses");
  res.json({
    data: userAddresses.addresses
  });
}

exports.addUserAddress = async (req, res, next) => {
  try {
    const { label, completeAddress, coordinates } = req.body;
    const newAddress = new Address({ label, completeAddress, coordinates });
    await newAddress.save();
    await User.findByIdAndUpdate(
      res.locals.loggedInUser._id,
      { $addToSet: { addresses: newAddress }},
      (err) => {
        if (err) return res.status(500).json({error: err});
      }
    );
    res.json({
      data: newAddress,
      message: "New address added!"
    })
  } catch (error) {
    next(error)
  }
}

exports.updateAddress = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;
    await Address.findByIdAndUpdate(addressId, req.body);
    const address = await Address.findById(addressId)
    res.status(200).json({
      data: address
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteAddress = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;
    await Address.findByIdAndDelete(addressId);
    await User.findByIdAndUpdate(
      res.locals.loggedInUser._id,
      { $pull: {addresses: addressId } },
      (err, res) => {
        if (err) {
          return res.json({error: err})
        }
      }
    );
    res.status(200).json({
      data: addressId
    });
  } catch (error) {
    next(error)
  }
}
