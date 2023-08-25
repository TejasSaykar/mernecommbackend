import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { allCategoryController, createCategoryController, deleteCategortController, singleCategoryController, updateCategoryController } from '../controllers/CategoryController.js';

const router = express.Router();

// Routes
// Create Category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// Update Category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

// Get all categories
router.get("/all-category", allCategoryController);

// Single Category
router.get("/single-category/:slug", singleCategoryController);

// Delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategortController)

export default router;