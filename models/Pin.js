const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    require: true,
    min: 3,
  },
  desc: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
    min: 0,
    max: 5,
  },
  image: { 
    type: String,
  },
  long: {
    type: Number,
    require: true,
  },
  lat: {
    type: Number,
    require: true,
  },
  createdAt: {type: Date, default: Date.now}
}
);

module.exports = mongoose.model("Pin", PinSchema);
