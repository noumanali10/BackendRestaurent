const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  seat: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("table", tableSchema);
