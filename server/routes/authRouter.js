import express from "express";
import { loginController, logoutController, updateRoleController, registerController } from "../controller/authController.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/googleLogin", loginController);
router.get("/logout", logoutController);

router.patch("/update-role", protect,updateRoleController)

export default router;