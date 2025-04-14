import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";
import { validationResult } from "express-validator";

//import utils
import { sentMail } from "../utils/sentEmail.js";

// register
export const userRegister = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password } = req.body;

  try {
    const exists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(400).json({
        message: "อีเมลหรือชื่อผู้ใช้ถูกใช้งานแล้ว",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ email, username, password: hashPassword });

    await newUser.save();

    return res.status(201).json({
      message: "ลงทะเบียนสำเร็จ",
    });
  } catch (err) {
    console.error(err); // optional log error
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในระบบ",
    });
  }
};

// Login
export const userLogin = async (req, res) => {
  const erroes = validationResult(req);

  if (!erroes.isEmpty()) {
    res.status(400).json({ erroes: erroes.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const Ismatch = await bcrypt.compare(password, user.password);
    if (!Ismatch) {
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

//update
export const userUpdate = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // ตัวอย่าง: เช็คว่า user กำลังพยายามแก้ไขข้อมูลของตัวเอง
  if (req.user.id !== id) {
    return res.status(403).json({ message: "Permission denied." });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const userDelete = async (req, res) => {
  const { id } = req.params; // เข้าถึง id จาก req.params

  try {
    const isMatch = await userModel.findByIdAndDelete(id);

    if (!isMatch) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//sent-otp
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // ตัวเลข 6 หลัก
    const expire = Date.now() + 1000 * 60 * 5; // 5 นาที

    user.otp = otp;
    user.otpExpires = expire;
    await user.save();

    await sentMail(
      email,
      otp
    );

    return res.json({ message: "OTP sent to email successfully" });
  } catch (err) {
    console.error(err); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อผิดพลาด
    return res.status(500).json({ message: "Something went wrong" });
  }
};


//update Password
export const passwordUpdate = async(req, res) => {
  
}