import jwt from "jsonwebtoken";
import { usersCollection } from "../../config/db.js";

const verifyToken = async (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

const verifyMember = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await usersCollection.findOne({ email });
  if (!user || user?.role !== "member") {
    return res.status(403).send({ message: "Forbidden access - members only" });
  }
  next();
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await usersCollection.findOne({ email });
  if (!user || user?.role !== "admin") {
    return res.status(403).send({ message: "Forbidden access - admin only" });
  }
  next();
};

export { verifyToken, verifyMember, verifyAdmin };
