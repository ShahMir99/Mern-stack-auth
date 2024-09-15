import bcrypt from "bcryptjs";
import crypto from "crypto"

import { User } from "../models/index.js";
import { genTokenAndCookies } from "../utils/genTokenAndCookies.js";
import { generateVerificationCode } from "../utils/genVeriTokens.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomEmail } from "../mailtrap/email.js";
import {sendErrorResponse, sendSuccessResponse} from "../utils/responseHandler.js";
import { Config } from "../config/index.js";



const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {

    if (!name || !email || !password) {
      return sendErrorResponse(res, 400, "All fields are required");
    }

    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return sendErrorResponse(res, 409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const createUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await createUser.save();
    genTokenAndCookies(res, createUser._id);

    await sendVerificationEmail(createUser.email, verificationCode);

    const userwithOutPass = createUser.toObject();
    delete userwithOutPass.password;

    return sendSuccessResponse(res, 201, "User created successfully", userwithOutPass);

  } catch (error) {
    console.log("Error in creating user", error);
    return sendErrorResponse(res, 500, "Internal server error", error);
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return sendErrorResponse(res, 400, "Invalid or Expire verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await sendWelcomEmail(user.name, user.email);

    const userwithOutPass = user.toObject();
    delete userwithOutPass.password;

    return sendSuccessResponse(res, 201, "Welcome email sent successfully", userwithOutPass
    );
  } catch (error) {
    console.log("error in verifying user", error);
    return sendErrorResponse(res, 500, "Internal server error", error);
  }
};

const logIn = async (req, res) => {
  const {email, password} = req.body;
  try {
    
    const findUser = await User.findOne({email})
    if(!findUser){
      return sendErrorResponse(res, 400, "Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password , findUser.password)
    if(!isPasswordValid){
      return sendErrorResponse(res, 400, "Invalid credentials")
    }

    genTokenAndCookies(res, findUser._id)
    findUser.lastLogin = Date.now()
    await findUser.save()

    const userWithoutPass = findUser.toObject()
    delete userWithoutPass.password
    
    return sendSuccessResponse(res, 200, "User login Successfully", userWithoutPass)
    
  } catch (error) {
    console.log("Error in login user", error);
    return sendErrorResponse(res, 500, "Internal server error", error);
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return sendSuccessResponse(res, 200, "User logout Successfully");
  } catch (error) {
    console.log("Error in logging Out", error);
    return sendErrorResponse(res, 500, "Internal server error")
  }
};

const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try {
    
    const findUser = await User.findOne({email})

    if(!findUser){
      return sendErrorResponse(res, 400, "User not found")
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetTokenExpiresAt = Date.now() + 10 * 60 * 1000 //10 mintues

    findUser.resetPasswordToken = resetToken
    findUser.resetPasswordExpiresAt = resetTokenExpiresAt
    await findUser.save()

    const origin = `${Config.clientUrl}/reset-password/${resetToken}`
    await sendPasswordResetEmail(findUser.email, origin)

    return sendSuccessResponse(res, 200, "Password reset link sent to your email")

  } catch (error) {
    console.log("Error in password reset request", error);
    return sendErrorResponse(res, 500, "Internal server error")
  }
}


const resetPassword = async (req, res) => {
  const {email} = req.body;
  try {

    return sendSuccessResponse(res, 200, "Password reset link sent to your email")
    
  } catch (error) {
    console.log("Error in password reset request", error);
    return sendErrorResponse(res, 500, "Internal server error")
  }
}

export default {
  signUp,
  logIn,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword
};
