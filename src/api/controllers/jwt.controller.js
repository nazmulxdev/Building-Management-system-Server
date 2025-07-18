import jwt from "jsonwebtoken";
import "dotenv/config";
const tokenController = async (req, res) => {
  const { email } = req.body;
  const user = { email };
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.send({ success: true });
};

const unMountToken = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
  });
  res.status(200).send({ message: "logged out , cookie cleared" });
};

export { tokenController, unMountToken };
