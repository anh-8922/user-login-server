import express from "express";
import {
  handleRegister,
  handleUpdateProfile,
  handleLogin,
  handleLogout,
  handleEmailConfirm,
  handleForgotPass,
  handleChangePass,
} from "../controllers/userController.js";

import upload from "../config/multer-cloudinary.js";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/emailconfirm", handleEmailConfirm);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/forgotpass", handleForgotPass);
router.post("/changepass", handleChangePass);
router.put("/updateprofile", upload.single("image"), handleUpdateProfile);

export default router;
