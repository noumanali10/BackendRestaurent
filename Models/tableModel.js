const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  TableNumber:{
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  seat: {
    type: Number,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },  
});

module.exports = mongoose.model("table", tableSchema);
