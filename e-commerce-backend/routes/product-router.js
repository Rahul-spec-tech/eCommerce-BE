const express = require("express");
const router = express.Router();
const product = require("../controller/product-controller");

router.get("/", product.getAllProducts);
router.get("/categories", product.getProductCategories);
router.get("/category/:category", product.getProductsInCategory);
router.get("/:id", product.getProduct);
router.post("/addProduct", product.addProduct);
// router.put("/:id", product.editProduct);
// router.patch("/:id", product.editProduct);
router.delete("/:id", product.deleteProduct);

module.exports = router;
