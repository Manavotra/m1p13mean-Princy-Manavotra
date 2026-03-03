// src/utils/cloudinaryUpload.js
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

const PLACEHOLDERS = ['ton_cloud', 'ta_cle', 'ta_clé', 'ton_secret', 'your_cloud', 'your_key', 'your_secret', 'xxx'];

const isConfigured = () => {
  const name   = process.env.CLOUDINARY_CLOUD_NAME  || '';
  const key    = process.env.CLOUDINARY_API_KEY     || '';
  const secret = process.env.CLOUDINARY_API_SECRET  || '';

  if (!name || !key || !secret) return false;

  // Rejette les valeurs placeholder
  for (const p of PLACEHOLDERS) {
    if (name.includes(p) || key.includes(p) || secret.includes(p)) return false;
  }

  return true;
};

const saveLocally = (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.resolve("uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filename  = Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
      const filepath  = path.join(uploadsDir, filename);
      const localPath = "uploads/" + filename;
      fs.writeFileSync(filepath, buffer);
      console.log("Local upload:", localPath);
      resolve({ secure_url: localPath, public_id: null });
    } catch (err) {
      reject(err);
    }
  });
};

export const uploadBufferToCloudinary = (buffer, options = {}) => {
  if (!isConfigured()) {
    console.log("Cloudinary non configure -> stockage local");
    return saveLocally(buffer);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: options.folder || "uploads", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  if (!isConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.warn("Cloudinary delete failed:", e.message);
  }
};