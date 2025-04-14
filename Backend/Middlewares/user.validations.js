import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail().withMessage("อีเมลไม่ถูกต้อง"),
  body("username").notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
];

export const loginValidetion = [
  body("email").isEmail().withMessage("อีเมลไม่ถูกต้อง"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
];
