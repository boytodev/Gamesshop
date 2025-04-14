import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // เพิ่มข้อมูล user ลงใน req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

//verify OTP

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // ค้นหาผู้ใช้จากอีเมล และตรวจสอบว่า OTP ตรงกันและยังไม่หมดอายุ
      const user = await userModel.findOne({
        email,
        otp,
        otpExpires: { $gt: Date.now() },  // ตรวจสอบว่า OTP ไม่หมดอายุ
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      // ✅ OTP ถูกต้อง ล้างค่า
      user.otp = null;
      user.otpExpires = null;
      await user.save();
  
      return res.json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
  };
  