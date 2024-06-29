import mongoose from 'mongoose';

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
        required: true,
    },
    rating:{
        type: Number,
        default:0
    },
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
    image: {
        type: String,
        required: true,
    },
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
                required:true
            },
        }
    ],
    createdAt:{
        type: Date,
        default:Date.now
    }

});

const Product = mongoose.model('Product', productSchema);

export default Product;
