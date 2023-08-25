import express from 'express';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js'
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productFiltersController, productImgController, productListController, prouctCountController, relatedProductController, searchProductController, updateProductController } from '../controllers/ProductController.js';
import formidable from 'express-formidable'


const router = express.Router();

// Route
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController)

// Get all Products
router.get("/get-product", getProductController);

// Single Product
router.get("/get-product/:slug", getSingleProductController);

// Get image
router.get("/product-img/:pid", productImgController);

// Delete Product
router.delete("/delete-product/:pid", deleteProductController)

// Update Product
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(),updateProductController)

// Filter Product
router.post("/product-filters", productFiltersController);

// Product Count
router.get("/product-count", prouctCountController);

// Product Per Page
router.get("/product-list/:page", productListController);

// Search Product
router.get("/search/:keyword", searchProductController);

// Similar Product
router.get("/related-product/:pid/:cid", relatedProductController)

// Category wise product
router.get("/product-category/:slug", productCategoryController);

// Payment Route
router.get("/braintree/token", braintreeTokenController);

// Payments

router.post("/braintree/payment", requireSignIn, braintreePaymentController)

export default router;
