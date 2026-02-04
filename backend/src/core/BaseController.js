// src/core/BaseController.js
export default class BaseController {
  constructor(Model) {
    this.Model = Model;
  }

  getAll = async (req, res) => {
    try {
      const data = await this.Model.find();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };

  getOne = async (req, res) => {
    try {
      const item = await this.Model.findById(req.params.id);
      res.json(item);
    } catch (e) {
      res.status(404).json({ error: 'Not found' });
    }
  };

  create = async (req, res) => {
    try {
      const item = await this.Model.create(req.body);
      res.status(201).json(item);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

  update = async (req, res) => {
    try {
      const item = await this.Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(item);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

  delete = async (req, res) => {
    try {
      await this.Model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Supprimé' });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };
}
