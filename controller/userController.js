import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import NotFoundError from "../errors/not-found.js";
import CustomAPIError from "../errors/custom-api.js";
import BadRequestError from "../errors/bad-request.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import createUserToken from "../utils/createTokenUser.js";
import { attachCookiesToResponse } from "../utils/tokenUtils.js";
import checkPermissions from "../utils/checkPermissions.js";

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    throw new NotFoundError();
  }

  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createUserToken(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide both Values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Success: password updated" });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
