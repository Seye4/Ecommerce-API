import express from "express";

import {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from "../controller/reviewController.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();

router.route("/getAllReviews").get(authenticateUser, getAllReviews); // get all review

router.route("/createReview").post(authenticateUser, createReview); // create a new review

router.route("/getSingleReview/:id").get(getSingleReview); // get a single review

router.route("/updateReview/:id").patch(authenticateUser, updateReview); // update a review

router.route("/:id").delete(authenticateUser, deleteReview); // delete review

export default router;
