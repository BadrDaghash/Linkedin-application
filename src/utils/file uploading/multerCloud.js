import multer from "multer";
import path from "path";

// Allowed file types
export const fileValidation = {
  images: ["image/png", "image/jpeg", "image/jpg"],
  documents: ["application/pdf"], // ✅ Add support for PDF files
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer upload middleware
export const uploadLocal = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      fileValidation.images.includes(file.mimetype) || // Allow images
      fileValidation.documents.includes(file.mimetype) // ✅ Allow PDF files
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPEG, JPG, and PDF files are allowed!"), false);
    }
  },
});
