import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: [true, "please Enter value"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "please Enter password"],
        minlength: [8, "should be atleaset 8 characters"],

    },
 
    image: {
        type: String,

    }
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)
export default userModel;