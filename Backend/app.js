import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

//Import Router
import userRouter from './Router/user.route.js'

dotenv.config();

//Connect DB
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database Connected Successfuly");
  })
  .catch((err) => {
    console.error(`Database No Connected ${err}`);
  });

//Create Serve
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use('/api/user', userRouter)

//PORT
const PORT = process.env.PORT || 4000;

//ServerRun
app.listen(PORT, () => {
  console.log(`Server Listen on PROT: ${PORT}`);
});
