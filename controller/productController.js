import { StatusCodes } from "http-status-codes";
import Product from "../models/Product.js";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import Review from "../models/Review.js";
import { count } from "console";

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate("reviews");
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

1;
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) throw new NotFoundError(`No product with id: ${productId}`);

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new NotFoundError(`No product with id: ${productId}`);

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) throw new NotFoundError(`No product with id: ${productId}`);

  await product.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Success! Product Removed" });
};

const uploadImage = async (req, res) => {
  if (!req.files) throw new BadRequestError("NO FILE UPLOADED");

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1mb");
  }

  const __dirname = dirname(fileURLToPath(import.meta.url)); // get the resolved path to the file

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
