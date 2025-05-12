const express = require("express");
const router = express.Router();
const {
  getProducts,
  getOneProduct,
  postProduct,
  putProduct,
  deleteProduct,
  getProductsByType,
} = require("../Controllers/productContoller");

router.get("/products", getProducts); 
router.get("/products/:id", getOneProduct);
router.post("/products", postProduct); 
router.put("/products/:id", putProduct); 
router.delete("/products/:id", deleteProduct); 
router.get("/products/type/:type", getProductsByType); 

module.exports = router;
