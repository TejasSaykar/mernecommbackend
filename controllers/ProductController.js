import ProductModel from "../models/ProductModel.js";
import CategoryModel from "../models/CategoryModel.js";
import OrderModel from "../models/OrderModel.js";
import slugify from 'slugify'
import fs from 'fs'
import braintree from 'braintree';

import dotenv from 'dotenv';

dotenv.config();


// Payment getway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})


export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, qty, shipping } = req.fields;
        const { img } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ message: "Name is required" });
            case !description:
                return res.status(500).send({ message: "Description is required" });
            case !price:
                return res.status(500).send({ message: "Price is rrequired" });
            case !category:
                return res.status(500).send({ message: "Category is required" });
            case !qty:
                return res.status(500).send({ message: "Quantity is required" });
            case img && img.size > 10000:
                return res.status(500).sen({ message: "Image is required and size shuld be less than 1mb" });
        }

        const products = new ProductModel({ ...req.fields, slug: slugify(name) });
        if (img) {
            products.img.data = fs.readFileSync(img.path);
            products.img.contentType = img.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            products
        })

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while creating product",
            error
        })

    }
}

// Get all products
export const getProductController = async (req, res) => {
    try {
        const products = await ProductModel.find({}).populate('category').select("-img").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: "AllProducts",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting error",
            error
        })

    }
}

// Get single Product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ slug: req.params.slug }).select("-img").populate("category");
        res.status(200).send({
            success: true,
            message: "Single product fetched",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting single product",
            error
        })

    }
}

// Get Image
export const productImgController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("img");
        if (product.img.data) {
            res.set('Content-type', product.img.contentType);
            return res.status(200).send(product.img.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting product image",
            error
        })

    }
}

// Delete Product

export const deleteProductController = async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.pid).select("-img");
        res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting the product",
            error
        })
    }
}

// Update Product
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, qty } = req.fields;
        const { img } = req.files;

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ message: "Name is required" });
            case !description:
                return res.status(500).send({ message: "Description is required" });
            case !price:
                return res.status(500).send({ message: "Price is rrequired" });
            case !category:
                return res.status(500).send({ message: "Category is required" });
            case !qty:
                return res.status(500).send({ message: "Quantity is required" });
            case img && img.size > 10000:
                return res.status(500).sen({ message: "Image is required and size shuld be less than 1mb" });
        }

        const products = await ProductModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (img) {
            products.img.data = fs.readFileSync(img.path);
            products.img.contentType = img.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product updated successfully",
            products
        })

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while updating product",
            error
        })

    }
}

// Product Filter 
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await ProductModel.find(args);
        res.status(201).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while filtering products",
            error
        })

    }
}

// Product Count 
export const prouctCountController = async (req, res) => {
    try {
        const total = await ProductModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error
        })

    }
}

// Product List Controller
export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await ProductModel.find({}).select("-img").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in per page ctrl",
            error
        })

    }
}


// Search Product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-img")
        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while searching the product",
            error
        })

    }
}


// Similar Products 
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await ProductModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-img').limit(4).populate("category");
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while getting similar products",
            error
        })

    }
}

// Category Wise Product
export const productCategoryController = async (req, res) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug });
        const products = await ProductModel.find({ category }).populate('category');
        res.status(201).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while getting category wise product",
            error
        })

    }
}


// Payment getway api
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error);

    }
}


// Payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new OrderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            });
    } catch (error) {
        console.log(error);
    }
}