import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../Controllers/cartController.js";

import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();

// เพิ่มสินค้าลงตะกร้า
router.post("/add", verifyToken, addToCart);

// ดูตะกร้าทั้งหมด
router.get("/", verifyToken, getCart);

// อัปเดตจำนวนสินค้า
router.put("/update", verifyToken, updateCartItem);

// ลบสินค้าชิ้นเดียวออก
router.delete("/remove/:productId", verifyToken, removeCartItem);

// ลบตะกร้าทั้งหมด
router.delete("/clear", verifyToken, clearCart);

export default router;
