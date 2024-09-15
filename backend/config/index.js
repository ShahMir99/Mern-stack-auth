import * as dotenv from "dotenv"
dotenv.config()

export const Config = {
    mongoURI : process.env.DATABASE_URI,
    dbName : process.env.DATABASE_NAME,
    port : process.env.PORT || 5000,
    jwtSecret : process.env.JWT_SECRET,
    nodeEnv : process.env.NODE_ENV,
    clientUrl : process.env.CLIENT_URL,

    mailTrap : {
        token : process.env.MAILTRAP_TOKEN
    }

}