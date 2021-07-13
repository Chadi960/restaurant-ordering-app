const Branch = require('../models/branch.model');

exports.getBranches = async (req, res, next) => {
  const branches = await Branch.find({});
  res.status(200).json({
    data: branches
  });
}

exports.addBranch = async (req, res, next) => {
  try {
    const { name, coordinates } = req.body;
    const newBranch = new Branch({ name, coordinates });
    await newBranch.save();
    res.status(200).json({
      data: newBranch,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateBranch = async (req, res, next) => {
  try {
    const branchId = req.params.branchId;
    await Branch.findByIdAndUpdate(branchId, req.body);
    const branch = await Branch.findById(branchId);
    res.status(200).json({
      data: branch
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteBranch = async (req, res, next) => {
  try {
    const branchId = req.params.branchId;
    await Branch.findByIdAndDelete(branchId, (error, res) => {
      if (error) {
        res.status(500).json({
          error: error
        });
      }
    });

    res.status(200).json({
      data: branchId
    });
  } catch (error) {
    next(error)
  }
}
