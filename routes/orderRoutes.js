import {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} from "../controller/orderController.js";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication.js";

import express from "express";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermission("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

export default router;
