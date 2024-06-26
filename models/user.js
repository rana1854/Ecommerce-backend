import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "User",

    }
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema)
export default userModel;