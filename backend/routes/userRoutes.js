import express from "express";
import auth from "../middleware/auth.js";
import userdetails from "../controllers/userController.js";
const router = express.Router();
router.use(auth);
router.get("/",userdetails);
export default router