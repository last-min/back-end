const Product = require("../model/product");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products && products.length > 0) {
      res.status(200).json({ products });
    } else {
      res.status(404).json({ msg: "No products found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching products" });
  }
};

const getOneProduct = async (req, res) => {
    const id = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid product ID format" });
    }
  
    try {
      const foundProduct = await Product.findById(id);
      if (foundProduct) {
        res.status(200).json({ product: foundProduct });
      } else {
        res.status(404).json({ msg: "No product found with the given ID" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error retrieving the product" });
    }
  };

const postProduct = async (req, res) => {
  const product = req.body;
  try {
    const newProduct = new Product(product);
    await newProduct.save();
    res.status(200).json({ product: newProduct, msg: "Product successfully added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error adding product" });
  }
};

const putProduct = async (req, res) => {
  const id = req.params.id;
  const productData = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (updatedProduct) {
      res.status(200).json({ product: updatedProduct, msg: "Product successfully updated" });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      res.status(200).json({ msg: "Product successfully deleted" });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting product" });
  }
};

const getProductsByType = async (req, res) => {
  const type = req.params.type;
  try {
    const products = await Product.find({ type });
    if (products && products.length > 0) {
      res.status(200).json({ products });
    } else {
      res.status(404).json({ msg: `No products found for type: ${type}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching products by type" });
  }
};

module.exports = {
  getProducts,
  getOneProduct,
  postProduct,
  putProduct,
  deleteProduct,
  getProductsByType,
};