const Category = require('../models/category.model');

exports.getCategories = async (req, res, next) => {
  const categories = await Category.find({});
  res.status(200).json({
    data: categories
  });
}

exports.getCategories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;
    const categories = await Category.find({})
      .skip(skip)
      .limit(limit)

    Category.countDocuments({}, (err, count) => {
      if (err) {
        return res.status(500).json({
          error: err
        })
      }

      res.status(200).json({
        data: categories,
        count: count
      });
    });
  } catch (error) {
    next(error)
  }
}

exports.addCategory = async (req, res, next) => {
  try {
    const { name, type } = req.body;
    const newCategory = new Category();
    newCategory.name = name;
    newCategory.type = type;
    await newCategory.save();
    res.status(200).json({
      data: newCategory
    })
  } catch (error) {
    next(error)
  }
}

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    await Category.findByIdAndUpdate(categoryId, req.body);
    const updatedCategory = await Category.findById(categoryId);
    res.status(200).json({
      data: updatedCategory
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    await Category.findByIdAndDelete(categoryId, (error, res) => {
      if (error) {
        res.status(500).json({
          error: error
        });
      }
    });

    res.status(200).json({
      data: categoryId
    });
  } catch (error) {
    next(error)
  }
}
