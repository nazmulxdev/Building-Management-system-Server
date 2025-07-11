import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "My-Home-Users",
  },
});

const upload = multer({ storage: storage });
export default upload;
