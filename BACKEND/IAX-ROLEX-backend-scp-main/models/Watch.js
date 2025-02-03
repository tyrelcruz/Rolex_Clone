const { timeStamp } = require("console");
const mongoose = require("mongoose");

const WatchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the watch name"],
      maxLength: 50,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide the watch price"],
    },
    description: {
      type: String,
      minLength: 3,
      maxLength: 300,
    },
    stockQuantity: {
      type: Number,
      min: 0,
    },
    watchImage: {
      type: String,
      required: [true, "please provide the watch image"],
    },
    category: {
      type: String,
      enum: ["men", "women"],
      required: [true, "please provide a category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Watch", WatchSchema);
