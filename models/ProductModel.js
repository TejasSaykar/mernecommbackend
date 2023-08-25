import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        toLowerCase : true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        reuired: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true,
    },
    qty: {
        type: Number,
        reuired: true
    },
    img: {
        data: Buffer,
        contentType: String,
    },
    shipping: {
        type: Boolean
    }
}, { timestamps: true });

export default mongoose.model("Products", productSchema);