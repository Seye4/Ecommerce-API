import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controller/userController.js";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";

const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermission("admin"), getAllUsers); // get all user route

router.route("/showMe").get(authenticateUser, showCurrentUser); // get all user route

router.route("/updateUser").patch(authenticateUser, updateUser); // update user details

router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword); // update user password

router.route("/:id").get(authenticateUser, getSingleUser); // get single user route

export default router;
