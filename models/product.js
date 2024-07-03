import mongoose from 'mongoose';
import imagesSchema from './mutipleimages.js';
// import Category from './category';
// const imageSchema = new mongoose.Schema({
//     filename: {
//         type: String,
//         required: true,
//     },
//     path: {
//         type: String,
//         required: true
//     },
//     uploadDate: {
//         type: Date,
//         default: Date.now
//     }
// });


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    ratings: {
        type: Number,
        default: 0
    },
    // category: {
    //     type: String,
    //     required: [true, "Please Enter Product Category"],
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Assuming Category is another model in application
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', //Assuming user is another model in application
        required: true,
    },
    image: [imagesSchema],
    stock: {
        type: Number,
        required: [true, "please enter product stock"],
        maxLength: [4, "stock can not exceed 4 charcters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Product = mongoose.model('Product', productSchema);

export default Product;
