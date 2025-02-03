const { StatusCodes } = require("http-status-codes");
const Cart = require("../models/Cart");
const { NotFoundError, BadRequestError } = require("../errors");
const Watch = require("../models/Watch");

const getCartByUserId = async (req, res) => {
  const { userId } = req.user;
  const cart = await Cart.find({ userId });
  if (!cart) {
    throw new NotFoundError(`No cart found for userId: ${userId}`);
  }
  res.status(StatusCodes.OK).json({ cart, userId });
};

const clearCart = async (req, res) => {
  const { userId } = req.user;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new NotFoundError(`No cart found with userId: ${userId}`);
  }

  cart.items = [];
  await cart.save();

  res.status(StatusCodes.OK).json({ cleared: true });
};

const addToCart = async (req, res) => {
  const { userId } = req.user;
  const { watchId, quantity } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new NotFoundError(`No cart found with userId: ${userId}`);
  }

  const watch = await Watch.findById(watchId);
  if (!watch) {
    throw new NotFoundError(`No watch found with watchId: ${watchId}`);
  }

  await cart.addToCart(watchId, quantity);
  res.status(StatusCodes.OK).json({ cart, added: true });
};

const removeFromCart = async (req, res) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new NotFoundError(`No cart found with userId: ${userId}`);
  }

  const success = await cart.removeFromCart(itemId);
  if (!success) {
    throw new NotFoundError(`No item found with itemId: ${itemId}`);
  }

  res.status(StatusCodes.OK).json({ cart, removed: true });
};

const updateCart = async (req, res) => {
  const { userId } = req.user;
  const { itemId, quantity } = req.body;

  if (!itemId || !quantity) {
    throw new BadRequestError("Please provide itemId and quantity");
  }
  if (quantity <= 0) {
    throw new BadRequestError("Quantity must be greater than 0");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new NotFoundError(`No cart found with userId: ${userId}`);
  }

  const success = await cart.updateCartItem(itemId, quantity);
  if (!success) {
    throw new NotFoundError(`No cart item found with itemId: ${itemId}`);
  }

  res.status(StatusCodes.OK).json({ cart, updated: true });
};

const getAllCarts = async (req, res) => {
  const carts = await Cart.find({});
  res.status(StatusCodes.OK).json({ carts });
};

module.exports = {
  getCartByUserId,
  clearCart,
  addToCart,
  removeFromCart,
  updateCart,
  getAllCarts,
};
