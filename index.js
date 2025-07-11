// this is for root file
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

// import routers
import { connectDB } from "./src/config/db.js";
import apartmentRoutes from "./src/api/routes/apartment.routes.js";

import uploadImageRoute from "./src/api/routes/upload.routes.js";

// starting
const app = express();
const port = process.env.port || 3000;

// project middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// connect to the database
connectDB();

// api routes

// all apartments route
app.use("/api", apartmentRoutes);

// image upload route in the cloudinary
app.use("/api", uploadImageRoute);

// root route

app.get("/", (req, res) => {
  res.send("My server is running ");
});

app.listen(port, () => {
  console.log("server is running on port", port);
});

export default app;
