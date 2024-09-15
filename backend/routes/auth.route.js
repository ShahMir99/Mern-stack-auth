import express from "express"
import authController from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup" , authController.signUp)
router.post("/login" , authController.logIn)
router.post("/logout" , authController.logOut)

router.post("/verify-email" , authController.verifyEmail)
router.post("/forgot-password" , authController.forgotPassword)
router.post("/reset-password/:token" , authController.resetPassword)

export default router