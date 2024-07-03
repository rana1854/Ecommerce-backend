import multer from "multer";
import path from "path";

const Astorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }

})

const filterFileHere = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(new Error("unsupported File"), false)
    }
}


const upload = multer({
    storage: Astorage,
   

})
export default upload;







