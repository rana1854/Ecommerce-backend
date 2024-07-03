import mongoose from 'mongoose';
import validator from 'validator';

// const iamgesSchema = new mongoose.Schema({
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
// })

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        validate: [validator.isEmail, "Enter a valid Email"]
    },
    password: {
        type: String,
        required: [false, "Please enter a password"],
        minlength: [8, "Should be at least 8 characters long"],

    },
    image: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Define the allowed roles
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);
export default userModel;
