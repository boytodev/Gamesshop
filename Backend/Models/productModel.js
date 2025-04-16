import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    images: [
      {
        filename: String,          // ชื่อไฟล์
        url: String,               // URL หรือ path ของรูป
        mimetype: String,          // ประเภทไฟล์
        size: Number               // ขนาดไฟล์
      }
    ],
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'hidden'],
      default: 'available'
    }
  }, { timestamps: true });

  export default model("Product", productSchema)