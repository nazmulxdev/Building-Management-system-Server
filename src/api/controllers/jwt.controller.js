import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "dotenv/config";
const tokenController = async (req, res) => {
  const { email } = req.body;
  const user = { email };
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });
  res.send({ success: true });
};

export { tokenController };
