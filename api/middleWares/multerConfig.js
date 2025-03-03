// middlewares/multerConfig.js
import multer from "multer";

// Multer Storage (memory storage)
const storage = multer.memoryStorage();

// File Filter - Accept only ZIP files
const fileFilter = (req, file, cb) => {
	if (file.mimetype === "application/zip") {
		cb(null, true);
	} else {
		cb(new Error("Only zip files are allowed"), false);
	}
};

// Set upload limits (100MB max)
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
}).single("file");

export default upload;
