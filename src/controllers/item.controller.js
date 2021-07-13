const Item = require('../models/item.model');
const Category = require('../models/category.model');

exports.getItems = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const skip = parseInt(req.query.skip) || 0;

    const query = {};

    if (req.query.category) {
      query.categories = req.query.category;
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const items = await Item.find(query)
      .skip(skip)
      .limit(limit);

    Item.countDocuments({}, (err, count) => {
      if (err) {
        return res.status(500).json({
          error: err
        })
      }

      res.status(200).json({
        data: items,
        count: count
      });
    });
  } catch (error) {
    next(error)
  }
}

exports.addItem = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newItem = new Item({ name, description });
    await newItem.save();
    res.status(200).json({
      data: newItem,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    await Item.findByIdAndUpdate(itemId, req.body);
    const updatedItem = await Item.findById(itemId);
    res.status(200).json({
      data: updatedItem
    });
  } catch (error) {
    next(error)
  }
}

exports.addItemCategory = async (req, res, next) => {
  try {
    await Category.exists({ _id: req.body.category }, (err, doc) => {
      if (err) {
        return next(new Error("Category doesn't exists"));
      }
    });

    await Item.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { categories: req.body.category }},
      (err) => {
        if (err) return res.status(500).json({error: err});
      }
    );
    res.json({
      message: "Category is added!"
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    await Item.findByIdAndDelete(itemId, (error, res) => {
      if (error) {
        res.status(500).json({
          error: error
        });
      }
    });

    res.status(200).json({
      data: itemId
    });
  } catch (error) {
    next(error)
  }
}

// preferable if this is in a "category service" but for simplicity sake I decided to place it here
const validateCategories = (categories) => {
  if (categories.length > 0) {
    categories.forEach((name) => Category.exists(name, (err, doc) => {
      if (err) {
        return next(new Error("Category doesn't exist"));
      }
    }))
  }
}
