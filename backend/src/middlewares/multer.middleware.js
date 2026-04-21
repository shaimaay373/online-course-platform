import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs"; // ✅ أضيف ده

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const uploadDir = join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const isVideo = file.mimetype.startsWith("video/");
  const isImage = file.mimetype.startsWith("image/");
  if (isVideo || isImage) {
    cb(null, true);
  } else {
    cb(new Error("Only images or videos are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

export default upload;