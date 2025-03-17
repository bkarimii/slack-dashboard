// middlewares/processUpload.js
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

export const processUpload = (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			return res.status(400);
		}

		if (!req.file) {
			return res.status(404);
		}

		if (req.file.mimetype !== "application/zip") {
			return res.status(400);
		}

		next();
	});
};
