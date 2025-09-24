const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnect");
const userRouter = require("./routes/userRoutes");
const vendorRouter = require("./routes/vendorRouter");
const productRouter = require("./routes/productRouter");
dotenv.config();

//PORT
const PORT = process.env.PORT || 3000;

//initialize app
const app = express();

// Database connection
connectDB();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", userRouter);
app.use("/", vendorRouter);
app.use("/products/", productRouter);

//server start
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
