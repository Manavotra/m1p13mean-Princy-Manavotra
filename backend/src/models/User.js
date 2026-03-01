// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['ADMIN', 'VENDEUR', 'ACHETEUR'],
    default: 'ACHETEUR'
  },

  avatar: String

}, { timestamps: true });

/* 🔐 Hash password */
UserSchema.pre('save', async function() {

  if (!this.isModified('password')) return;

  // Si déjà hashé
  if (this.password.startsWith('$2b$')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* 🔑 Compare password HYBRIDE */
UserSchema.methods.comparePassword = async function(password) {

  // 🔥 CAS 1 : Password déjà hashé
  if (this.password.startsWith('$2b$')) {
    return bcrypt.compare(password, this.password);
  }

  // 🔥 CAS 2 : Password en clair (ancien user)
  if (password === this.password) {

    // 👉 MIGRATION AUTO
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
    await this.save();

    return true;
  }

  return false;
};

export default mongoose.model('User', UserSchema);