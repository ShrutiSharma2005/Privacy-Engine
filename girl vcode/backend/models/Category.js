const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// NO user identity, NO raw behavior, NO PII — pure aggregate count only.
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
