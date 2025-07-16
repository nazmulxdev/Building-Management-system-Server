// this is for root file
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

// import routers
import { connectDB } from "./src/config/db.js";
import apartmentRoutes from "./src/api/routes/apartment.routes.js";
import jwtTokenRoutes from "./src/api/routes/jwt.routes.js";

import uploadImageRoute from "./src/api/routes/upload.routes.js";

import userRoleRoutes from "./src/api/routes/userRole.routes.js";
import agreementRoutes from "./src/api/routes/agreement.routes.js";
import announcementsRoutes from "./src/api/routes/announcements.routes.js";

import couponsRoutes from "./src/api/routes/coupons.routes.js";
// starting
const app = express();
const port = process.env.port || 3000;

// project middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// connect to the database
connectDB();

// api routes

// all apartments route
app.use("/api", apartmentRoutes);

// image upload route in the cloudinary
app.use("/api", uploadImageRoute);

// jwt token
app.use("/api", jwtTokenRoutes);

// users role based apis
app.use("/api", userRoleRoutes);

// agreement post route
app.use("/api", agreementRoutes);

// announcement route
app.use("/api", announcementsRoutes);

// coupons route
app.use("/api", couponsRoutes);
// root route

app.get("/", (req, res) => {
  res.send("My server is running ");
});

app.listen(port, () => {
  console.log("server is running on port", port);
});

export default app;
