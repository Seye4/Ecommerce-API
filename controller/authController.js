import { StatusCodes } from "http-status-codes";
//  import customeErrors from"../errors/"
import User from "../models/User.js";
import BadRequestError from "../errors/bad-request.js";
import { attachCookiesToResponse, createJWT } from "../utils/tokenUtils.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import createUserToken from "../utils/createTokenUser.js";

const register = async (req, res) => {
  //   const hashedPassword = await hashPassword(req.body.password);
  //   req.body.password = hashedPassword;
  const { email } = req.body;

  const emailAlreadyExist = await User.findOne({ email });

  if (emailAlreadyExist) {
    throw new BadRequestError("Email already exists");
  }

  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const user = await User.create(req.body);

  const tokenUser = createUserToken(user);

  attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide email and password");

  const user = await User.findOne({ email: req.body.email });

  const isValidUser = user && (await user.comparePassword(req.body.password));

  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");

  // const token = createJWT({ userId: user._id, role: user.role });

  const tokenUser = createUserToken(user);

  attachCookiesToResponse({ res, user: tokenUser });
  console.log(tokenUser);

  // res.status(StatusCodes.CREATED).json({ user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export { register, login, logout };
