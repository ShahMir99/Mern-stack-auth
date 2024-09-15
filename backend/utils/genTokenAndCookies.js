import jwt from "jsonwebtoken"
import { Config } from "../config/index.js"

export const genTokenAndCookies = (res, userId) => {
    const token = jwt.sign({userId}, Config.jwtSecret , {
        expiresIn : "7d"
    })

    res.cookie("token", token, {
     httpOnly : true, //Provent from XSS attacks 
     secure : Config.nodeEnv === "production",
     sameSite : "strict", // Provent from CSRF attacls
     maxAge : 7 * 24 * 60 * 60 * 1000
    })

    return token
}