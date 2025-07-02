import "express-async-errors";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import { connectDB } from "./db/connect.js";
import morgan from "morgan";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import router from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/v1", (req, res) => {
  res.send("this is homepage");
});

app.use("/api/v1/auth", router);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(/(.*)/, (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

// mongoose.set("strictQuery", false);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(
      port,
      console.log(`Connected to DB and server running on PORT ${port}....`)
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

start();
