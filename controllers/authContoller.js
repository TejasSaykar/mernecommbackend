import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken';
import OrderModel from '../models/OrderModel.js'

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, answer, address } = req.body;
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }

        if (!email) {
            return res.status(401).send({ message: "Email is required" })
        }

        if (!password) {
            return res.status(401).send({ message: "Password is required" })
        }

        if (!phone) {
            return res.status(401).send({ message: "Phone is required" })
        }

        if (!answer) {
            return res.status(401).send({ message: "Answer is required" })
        }

        if (!address) {
            return res.status(401).send({ message: "Address is required" })
        }

        // Existing user
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(401).send({
                success: false,
                message: "Already register please login"
            })
        }

        // Register the user
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({
            name,
            email,
            phone,
            answer,
            address,
            password: hashedPassword
        }).save();
        res.status(201).send({
            success: true,
            message: "Register Successfuly",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while register",
            error
        })
    }
}


// Login - method post

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        // check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd"
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while login",
            error
        })
    }
}
// Forgot Password Cotroller

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }

        if (!answer) {
            res.status(400).send({ message: "Answer is required" });
        }

        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }

        //  Check
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Wrong email or answer",
                error
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password reset successfully"
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Somthing Went Wrong",
            error
        })

    }
}


// Test controller ---------------------->
export const testController = (req, res) => {
    res.send("Protected Route")
}


// Update User Profile

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, address, phone, password } = req.body;
        const user = await userModel.findById(req.user._id);
        // Password
        if (password && password.length < 6) {
            return res.json({ error: "Password is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true });
        res.status(201).send({
            success: true,
            message: "Profile updated successfully",
            updateUser
        })

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while updating user profile",
            error
        })

    }
}

// Orders

export const getOrdersController = async (req, res) => {
    try {
        const orders = await OrderModel.find({ buyer: req.user._id }).populate("products", "-img").populate("buyer", "name");
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })

    }
}

// Get all Orders

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await OrderModel
            .find({})
            .populate("products", "-img")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })

    }
}


// Order status
export const orderStatusController = async (req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await OrderModel.findByIdAndUpdate(orderId, {status}, {new:true});
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : "Error while updating order status",
            error
        })
        
    }
}