const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();

  const cart = user.createEmptyCart();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token, cart });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password.");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid email");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Wrong password");
  }
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ name: user.getName(), token });
};
module.exports = { register, login };
