import multer from "multer";

// ===========================
// 📦 Storage mémoire (PROD OK)
// ===========================
const storage = multer.memoryStorage();

// ===========================
// 🔒 Filtrage sécurité images
// ===========================
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images jpg/png/webp sont autorisées"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;