import multer from "multer";
import path from "path";

// Use memory storage instead of disk for better production compatibility
const storage = multer.memoryStorage();

// File filter — allow ONLY CSV
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== ".csv") {
    return cb(new Error("Only CSV files allowed"));
  }

  cb(null, true);
};

const uploadCsv = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default uploadCsv;
