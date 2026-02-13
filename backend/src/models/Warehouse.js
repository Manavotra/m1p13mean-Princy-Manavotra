// models/Warehouse.js
import mongoose from 'mongoose';

const WarehouseSchema = new mongoose.Schema({
  name: String,
  location: {
    address: String,
    city: String
  }
});

export default mongoose.model('Warehouse', WarehouseSchema);
