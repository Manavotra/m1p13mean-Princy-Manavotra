// src/core/BaseController.js

import QueryBuilder from './QueryBuilder.js';

import fs from 'fs';

export default class BaseController {
  constructor(model) {
    this.model = model;
    this.populateFields = this.detectRelations(model);
  }

  // =========================
  // 🔎 Detect Relations + Virtuals
  // =========================
detectRelations(model) {
  const relations = [];

  const walkSchema = (schema, prefix = '') => {

    Object.keys(schema.paths).forEach(path => {

      const fullPath = prefix ? `${prefix}.${path}` : path;
      const field = schema.paths[path];

      // 🔹 Ref simple
      if (field.options?.ref) {
        relations.push(fullPath);
      }

      // 🔹 Tableau de ref
      if (
        field.instance === 'Array' &&
        field.caster?.options?.ref
      ) {
        relations.push(fullPath);
      }

      // 🔥 Subdocument (single nested)
      if (field.schema) {
        walkSchema(field.schema, fullPath);
      }

      // 🔥 Tableau de subdocuments
      if (
        field.instance === 'Array' &&
        field.schema
      ) {
        walkSchema(field.schema, fullPath);
      }

    });

    // 🔹 Virtual populate (uniquement root level)
    if (!prefix) {
      Object.keys(schema.virtuals).forEach(virtual => {
        const v = schema.virtuals[virtual];
        if (v.options?.ref) {
          relations.push(virtual);
        }
      });
    }
  };

  walkSchema(model.schema);
  

  return relations;
}

  // =========================
  // 🧠 Population automatique
  // =========================
  applyPopulation(query, req) {
    const populate = req.query.populate !== 'false';

    if (!populate || this.populateFields.length === 0) {
      return query;
    }

    this.populateFields.forEach(field => {
      query.populate({
        path: field,
        select: '-__v',
        options: { limit: 50 }
      });
    });

    return query;
  }

  getAll = async (req, res) => {
    try {

      const filter = QueryBuilder.buildFilter(
        req.query,
        this.model);

      let query = this.model.find(filter);

      query = this.applyPopulation(query, req);

      const data = await query;
      console.log(JSON.stringify(data, null, 2));

      res.json(data);

    } catch (err) {
      console.error("GET ALL ERROR:", err);
      res.status(500).json(err.message);
    }
  };

  getById = async (req, res) => {
    try {
      let query = this.model.findById(req.params.id);
      query = this.applyPopulation(query, req);
      const data = await query;
      res.json(data);
    } catch (err) {
      res.status(500).json(err.message);
    }
  };

  getOne = async (req, res) => {
    try {
      const item = await this.model.findById(req.params.id);
      res.json(item);
    } catch (e) {
      res.status(404).json({ error: 'Not found' });
    }
  };

  create = async (req, res) => {
    console.log("CREATE BODY:", req.body);
    try {

      // 🔥 Injecte fichiers si présents
      await this.processFiles(req);

      const item = await this.model.create(req.body);
      console.log("CREATED:", item);
      res.status(201).json(item);
    } catch (e) {
      console.error("CREATE ERROR:", e);
      res.status(400).json({ error: e.message });
    }
  };


  update = async (req, res) => {
    console.log("UPDATE HIT");
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    try {

      const oldDoc = await this.model.findById(req.params.id);

      // 🔥 Injecte fichiers si présents
      await this.processFiles(req);


      const updated = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
      );

      // 🔥 Nettoyage images inutilisées
// --- Nettoyage Cloudinary (public ids) ---
const oldPublicIds = this.extractPublicIds(oldDoc);
const newPublicIds = this.extractPublicIds(updated);
const toDeletePublicIds = oldPublicIds.filter(id => !newPublicIds.includes(id));

for (const publicId of toDeletePublicIds) {
  await this.deleteAsset(publicId);
}

// --- Nettoyage local (compat anciens paths) ---
const oldImages = this.extractImagePaths(oldDoc);
const newImages = this.extractImagePaths(updated);
const toDeleteLocal = oldImages.filter(p => !newImages.includes(p));

for (const p of toDeleteLocal) {
  await this.deleteAsset(p);
}

      console.log("Updated item:", updated);

      res.json(updated);

    } catch (e) {
      console.error("UPDATE ERROR:", e);
      res.status(400).json({ error: e.message });
    }
  };


  delete = async (req, res) => {
    console.log("delete");

    try {

      const doc = await this.model.findById(req.params.id);

const publicIds = this.extractPublicIds(doc);
for (const id of publicIds) {
  await this.deleteAsset(id);
}

const images = this.extractImagePaths(doc);
for (const p of images) {
  await this.deleteAsset(p);
}

      await this.model.findByIdAndDelete(req.params.id);

      res.json({ message: 'Deleted successfully' });

    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

  // =========================
  // IMAGES
  // =========================

  setDeepValue(obj, path, value) {
    const keys = path
      .replace(/\]/g, '')
      .split(/\[|\./);

    let current = obj;

    keys.forEach((key, index) => {

      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) {
          current[key] = isNaN(keys[index + 1]) ? {} : [];
        }
        current = current[key];
      }

    });
  }

async processFiles(req) {
  // Cas single file
  if (req.file) {
    // memoryStorage => buffer
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "uploads",
    });

    // 1) champ principal = URL (remplace l'ancien path local)
    this.setDeepValue(req.body, req.file.fieldname, result.secure_url);

    // 2) champ publicId associé (si ton schema le supporte)
    // Convention: si fieldname = "image", alors "imagePublicId"
    this.setDeepValue(req.body, `${req.file.fieldname}PublicId`, result.public_id);
  }

  // Cas multiple files
  if (req.files) {
    const files = Object.values(req.files).flat();

    for (const file of files) {
      const result = await uploadBufferToCloudinary(file.buffer, {
        folder: "uploads",
      });

      this.setDeepValue(req.body, file.fieldname, result.secure_url);
      this.setDeepValue(req.body, `${file.fieldname}PublicId`, result.public_id);
    }
  }
}
  extractImagePaths(obj, results = []) {
    if (!obj) return results;

    // 1. Si c'est une string, on vérifie si c'est un chemin d'image
    if (typeof obj === 'string') {
      const normalized = obj.replace(/\\/g, '/');
      if (normalized.includes('uploads/')) {
        results.push(obj);
      }
      return results;
    }

    // 2. Si c'est un tableau, on itère
    if (Array.isArray(obj)) {
      obj.forEach(item => this.extractImagePaths(item, results));
      return results;
    }

    // 3. Si c'est un objet (mais pas null, pas une Date, pas un ObjectId)
    if (typeof obj === 'object' && obj !== null && !(obj instanceof Date)) {
      
      // 🔥 PROTECTION : Si c'est un document Mongoose peuplé, 
      // on ne scanne que les données réelles (_doc) pour éviter la boucle infinie
      const target = obj._doc || obj;

      Object.keys(target).forEach(key => {
        // Optionnel : ignorer les clés internes Mongoose commençant par $ ou _
        if (key.startsWith('$')) return; 
        
        this.extractImagePaths(target[key], results);
      });
    }

    return results;
  }

  extractPublicIds(obj, results = []) {
  if (!obj) return results;

  if (typeof obj === "string") {
    return results;
  }

  if (Array.isArray(obj)) {
    obj.forEach(item => this.extractPublicIds(item, results));
    return results;
  }

  if (typeof obj === "object" && obj !== null && !(obj instanceof Date)) {
    const target = obj._doc || obj;

    Object.keys(target).forEach(key => {
      if (key.startsWith("$")) return;

      // convention: fields ending with PublicId
      if (key.toLowerCase().endsWith("publicid") && typeof target[key] === "string") {
        results.push(target[key]);
      } else {
        this.extractPublicIds(target[key], results);
      }
    });
  }

  return results;
}

async deleteAsset(value) {
  if (!value) return;

  // 1) Si c'est un public_id cloudinary (on assume que public_id ne contient pas "uploads/")
  // Ici on delete si ça ressemble à un public_id (string non vide)
  // -> La vraie source de vérité est extractPublicIds()
  try {
    await deleteFromCloudinary(value);
    console.log("🗑 Cloudinary deleted:", value);
    return;
  } catch (e) {
    // Si ce n'est pas un public_id valide, on continue en mode local
  }

  // 2) fallback: ancien mode local (uploads/)
  const normalized = value.replace(/\\/g, "/");
  if (normalized.includes("uploads/") && fs.existsSync(normalized)) {
    fs.unlinkSync(normalized);
    console.log("🗑 Local deleted:", normalized);
  }
}

}
