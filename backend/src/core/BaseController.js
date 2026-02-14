// src/core/BaseController.js
export default class BaseController {
  constructor(model) {
    this.model = model;
    this.populateFields = this.detectRelations(model);
  }

  // 🔎 Détection automatique des champs ref
  detectRelations(model) {
    const relations = [];

    Object.keys(model.schema.paths).forEach(path => {
      const field = model.schema.paths[path];

      if (field.options && field.options.ref) {
        relations.push(path);
      }

      // Cas tableau de références
      if (
        field.instance === 'Array' &&
        field.caster &&
        field.caster.options &&
        field.caster.options.ref
      ) {
        relations.push(path);
      }
    });

    return relations;
  }

  // 🧠 Population intelligente
  applyPopulation(query, req) {
    const populate = req.query.populate !== 'false';

    if (!populate || this.populateFields.length === 0) {
      return query;
    }

    this.populateFields.forEach(field => {
      query.populate({
        path: field,
        select: '-__v',
        options: { limit: 50 } // sécurité
      });
    });

    return query;
  }

  getAll = async (req, res) => {
    try {
      let query = this.model.find();
      query = this.applyPopulation(query, req);
      const data = await query;
      res.json(data);
    } catch (err) {
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
    console.log("create");
    try {
      const item = await this.model.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

  update = async (req, res) => {
    console.log("UPDATE HIT");
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    try {
      const item = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      console.log("Updated item:", item);

      res.json(item);
    } catch (e) {
      console.error("UPDATE ERROR:", e);
      res.status(400).json({ error: e.message });
    }
  };


  delete = async (req, res) => {
      console.log("delete");
    try {
      await this.model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Supprimé' });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

}
