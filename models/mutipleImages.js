import mongoose from "mongoose"
const imagesSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
})
export default imagesSchema