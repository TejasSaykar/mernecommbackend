import express from "express";
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "../controllers/authContoller.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Router object
const router = express.Router();

// Routing

// Register - Method post
router.post("/register", registerController);

// Login - method post
router.post("/login", loginController);

// Test route  ---------------------->
router.get("/test", requireSignIn, isAdmin, testController);

// Protected user auth route 
router.get("/user-auth", requireSignIn, (req,res)=> {
    res.status(200).send({ok : true});
});

// Protected admin auth route 
router.get("/admin-auth", requireSignIn, isAdmin, (req,res)=> {
    res.status(200).send({ok : true});
});

router.post("/forgot-password", forgotPasswordController);

// Update Profile
router.put("/update-profile", requireSignIn, updateProfileController);

// Orders
router.get("/orders", requireSignIn, getOrdersController)

// All orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Status Update
router.put("/order-status/:orderID", requireSignIn, isAdmin, orderStatusController)
export default router;