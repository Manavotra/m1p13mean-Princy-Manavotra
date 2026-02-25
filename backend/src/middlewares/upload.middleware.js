import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 🔧 Dossier upload (dev)
const uploadDir = 'uploads';

// Créer dossier si absent
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ===========================
// 📦 Storage local (DEV)
// ===========================
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }

});

// ===========================
// 🔒 Filtrage sécurité images
// ===========================
const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;