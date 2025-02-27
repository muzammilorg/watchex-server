import multer from "multer";
import { storage } from "../config/cloudinary.config.js";

const upload = multer({
    storage,
    limits: {fieldSize: 1024 * 1024 * 2 } // 2MB
})

export default upload;