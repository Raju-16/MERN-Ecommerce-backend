const Brand = require("../models/brands.model");

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (error) {
    res
      .status(400)
      .json({ alert: "brands is not fetched", Error: error.message });
  }
};

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res
      .status(400)
      .json({ alert: "brand is not created", Error: error.message });
  }
};
