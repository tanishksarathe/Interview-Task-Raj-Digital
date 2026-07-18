import express from "express";
import { loginController, logoutController, updateRoleController, registerController } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddlewares.js";
import { googleCallback } from "../controller/googleController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/googleLogin", loginController);
router.get("/logout", logoutController);

router.patch("/update-role", protect,updateRoleController)

router.get("/google/callback",protect,googleCallback);

export default router;