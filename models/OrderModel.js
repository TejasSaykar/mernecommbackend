import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products : [{
        type : mongoose.ObjectId,
        ref: "Products"
    }],
    payment : {},
    buyer : {
        type : mongoose.ObjectId,
        ref: "user"
    },
    status : {
        type : String,
        default : "Processing",
        enum : ["Not Process", "Processing", "Shipped", "Deliverd" , "cancel"]
    },
},{timestamps : true});

export default mongoose.model("Orders", orderSchema);