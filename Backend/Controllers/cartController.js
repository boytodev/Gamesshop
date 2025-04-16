import Cart from "../Models/cartModel.js";
import Product from "../Models/productModel.js";

// เพิ่มสินค้าลงในตะกร้า
export const addToCart = async (req, res) => {
  const userId = req.user.id; // รับ userId จาก JWT
  const { productId, quantity } = req.body;

  // ตรวจสอบว่า productId และ quantity ถูกส่งเข้ามาใน request หรือไม่
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "productId และ quantity ต้องมีการส่งเข้ามา" });
  }

  try {
    // ทำการเพิ่มสินค้าลงในตะกร้า
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      // ถ้าผู้ใช้ยังไม่มีตะกร้า สร้างตะกร้าใหม่
      const newCart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
      await newCart.save();
    } else {
      // ถ้ามีตะกร้าอยู่แล้ว ให้เพิ่มสินค้าลงในตะกร้า
      cart.items.push({ productId, quantity });
      await cart.save();
    }

    res.status(201).json({ message: "เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มสินค้า" });
  }
};

// ดูตะกร้าของผู้ใช้
export const getCart = async (req, res) => {
  try {
    // หาตะกร้าของผู้ใช้
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// อัปเดตจำนวนสินค้าของสินค้าที่อยู่ในตะกร้า
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // หาตะกร้าของผู้ใช้
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ค้นหาว่าสินค้าที่ต้องการอัปเดตมีอยู่ในตะกร้าหรือไม่
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // ถ้ามีสินค้าอยู่แล้วก็อัปเดต
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json({ message: "Cart updated", cart });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ลบสินค้าจากตะกร้า
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    // หาตะกร้าของผู้ใช้
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ลบสินค้าจากตะกร้า
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ลบตะกร้าทั้งหมด
export const clearCart = async (req, res) => {
  try {
    // ลบตะกร้าของผู้ใช้ทั้งหมด
    await Cart.findOneAndDelete({ userId: req.user.id });

    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
