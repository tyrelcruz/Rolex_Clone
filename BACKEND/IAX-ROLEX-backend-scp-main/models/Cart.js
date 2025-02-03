const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cart must belong to a user"],
      unique: true,
    },
    items: [
      {
        watchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Watch",
          required: [true, "Watch ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity cannot be less than 1"],
          max: [99, "Quantity cannot exceed 99"],
        },
      },
    ],
  },
  { timestamps: true }
);

CartSchema.methods.addToCart = async function (watchId, quantity) {
  const existingItem = this.items.find(
    (item) => item.watchId.toString() === watchId
  );

  if (existingItem) {
    existingItem.quantity += parseInt(quantity, 10);
  } else {
    this.items.push({ watchId, quantity: parseInt(quantity, 10) });
  }

  await this.save();
};

CartSchema.methods.removeFromCart = async function (itemId) {
  const itemIndex = this.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return false;
  }

  this.items.splice(itemIndex, 1);
  await this.save();
  return true;
};
CartSchema.methods.updateCartItem = async function (itemId, quantity) {
  const itemIndex = this.items.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (itemIndex === -1) {
    return false;
  }
  this.items[itemIndex].quantity = parseInt(quantity);
  await this.save();
  return true;
};

module.exports = mongoose.model("Cart", CartSchema);
