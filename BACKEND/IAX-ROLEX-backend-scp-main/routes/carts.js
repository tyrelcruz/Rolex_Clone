const express = require("express");
const router = express.Router();

const {
  getCartByUserId,
  clearCart,
  addToCart,
  removeFromCart,
  updateCart,
  getAllCarts,
} = require("../controllers/cart");

router.route("/").get(getAllCarts);

router.route("/cart").get(getCartByUserId).delete(clearCart);

router.route("/cart/items").post(addToCart).patch(updateCart);

router.route("/cart/items/:itemId").delete(removeFromCart);

module.exports = router;
