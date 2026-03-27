const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number
});

module.exports = mongoose.model('Order', orderSchema);
