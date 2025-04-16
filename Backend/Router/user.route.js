import express from "express";

//Import Controllers
import { changPasswordUseOTP, passwordUpdate, sendOTP, userLogin, userRegister, userUpdate } from "../Controllers/userController.js";

// Middleware
import {loginValidetion, registerValidation} from '../Middlewares/user.validations.js'
import { verifyOTP, verifyToken } from "../Middlewares/auth.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json("hellol");
});

userRouter.post("/register", registerValidation, userRegister);
userRouter.post('/login', loginValidetion, userLogin);
userRouter.put('/update/:id', verifyToken, userUpdate);
userRouter.get('/sent-otp', sendOTP)
userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/change-password',verifyToken, passwordUpdate)
userRouter.post('/changPasswort-OTP', changPasswordUseOTP)
export default userRouter;
