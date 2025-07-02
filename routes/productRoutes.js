import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
} from "../controller/productController.js";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";
import { getSingleProductReviews } from "../controller/reviewController.js";

const router = express.Router();

router.route("/getAllProducts").get(getAllProducts); // get all products

router.route("/getSingleProduct/:id").get(getSingleProduct); // update user details

router
  .route("/createProduct")
  .post([authenticateUser, authorizePermission("admin")], createProduct); // update user details

router.route("/uploadImage").post(uploadImage); // upload image

router
  .route("/updateProduct/:id")
  .patch([authenticateUser, authorizePermission("admin")], updateProduct); // update product

router
  .route("/deleteProduct/:id")
  .delete([authenticateUser, authorizePermission("admin")], deleteProduct); // delete product

router.route("/:id/reviews").get(getSingleProductReviews);

export default router;
