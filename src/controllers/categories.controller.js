const Category = require("../models/categories.model");

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(400)
      .json({ alert: "categories is not fetched", Error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (error) {
    res
      .status(400)
      .json({ alert: "category is not created", Error: error.message });
  }
};
