const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters'],
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[0-9 ()-]{7,20}$/, 'Enter a valid phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^$|^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [250, 'Address cannot exceed 250 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
