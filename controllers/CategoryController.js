import categoryModel from '../models/CategoryModel.js';
import slugify from 'slugify'
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
        }
        const existingCat = await categoryModel.findOne({ name });
        if (existingCat) {
            return res.status(200).send({
                success: false,
                message: "Category already present"
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: "New category created",
            category
        })

    } catch (error) {
        console.log(error);
        resizeBy.status(401).send({
            success: false,
            message: "Error in Category",
            error
        })

    }
}

// Update Category Controller

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        res.status(200).send({
            success: true,
            message: "Category Updated successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while update the cateogory",
            error
        })

    }
}


// Get all cat

export const allCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(201).send({
            success: true,
            message: "All category list",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while getting all categories",
            error
        })

    }
}


// Single Category

export const singleCategoryController = async (req, res) => {
    try {
        const singleCat = await categoryModel.findOne({ slug: req.params.slug });
        res.status(201).send({
            success: true,
            message: "Single category get successfully",
            singleCat
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while getting single category",
            error
        })

    }
}


// Delete Category

export const deleteCategortController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCat = await categoryModel.findByIdAndDelete(id);
        res.status(201).send({
            success: true,
            message: "Category deleted successfully",
            deletedCat
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error while deleting category",
            error
        })
    }
}