import { Schema, model } from "mongoose";

const userShema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  otp: String,
  otpExpires: Date,
});

export default model("User", userShema);
