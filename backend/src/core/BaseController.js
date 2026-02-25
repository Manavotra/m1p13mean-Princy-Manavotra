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

    // Champs classiques
    Object.keys(model.schema.paths).forEach(path => {
      const field = model.schema.paths[path];

      // Ref simple
      if (field.options?.ref) {
        relations.push(path);
      }

      // Tableau de ref
      if (
        field.instance === 'Array' &&
        field.caster?.options?.ref
      ) {
        relations.push(path);
      }
    });

    // Virtual populate
    Object.keys(model.schema.virtuals).forEach(virtual => {
      const v = model.schema.virtuals[virtual];
      if (v.options?.ref) {
        relations.push(virtual);
      }
    });

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
      this.processFiles(req);

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
      this.processFiles(req);


      const updated = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: 'after', runValidators: true }
      );

      // 🔥 Nettoyage images inutilisées
      const oldImages = this.extractImagePaths(oldDoc);
      const newImages = this.extractImagePaths(updated);

      const toDelete = oldImages.filter(path => !newImages.includes(path));

      toDelete.forEach(path => this.deleteFile(path));

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

      const images = this.extractImagePaths(doc);

      images.forEach(path => this.deleteFile(path));

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

  processFiles(req) {

    // Cas single file
    if (req.file) {
      this.setDeepValue(req.body, req.file.fieldname, req.file.path);
    }

    // Cas multiple files
    if (req.files) {

      Object.values(req.files).flat().forEach(file => {
        this.setDeepValue(req.body, file.fieldname, file.path);
      });
      }
  }

  extractImagePaths(obj, results = []) {

    if (!obj) return results;

    if (typeof obj === 'string') {

      // Normalise Windows + Linux
      const normalized = obj.replace(/\\/g, '/');

      if (normalized.includes('uploads/')) {
        results.push(obj);
      }
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => this.extractImagePaths(item, results));
    }

    if (typeof obj === 'object') {
      Object.values(obj).forEach(value => {
        this.extractImagePaths(value, results);
      });
    }

    return results;
  }


  deleteFile(path) {

    if (!path) return;

    const normalized = path.replace(/\\/g, '/');

    if (fs.existsSync(normalized)) {
      fs.unlinkSync(normalized);
      console.log("🗑 Deleted:", normalized);
    }
  }

}
