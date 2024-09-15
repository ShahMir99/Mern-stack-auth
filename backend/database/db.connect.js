import mongoose from "mongoose";


const connectDB = async (Database_Url, Database_Name) => {
    try{
        const DB_Options = {
            dbName : Database_Name
        }

        mongoose.set("strictQuery",false)
        await mongoose.connect(Database_Url,DB_Options)

        console.log("Database Connected Successfully..");
    }catch(err){
        console.log("Database Not connected", err);
        process.exit(1)
    }
}


export default connectDB;