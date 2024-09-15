// Global imports
import express from "express"
import cors from "cors"

// local imports
import connectDB from "./database/db.connect.js"
import Routes from "./routes/index.js"
import { Config } from "./config/index.js"

const app = express()

app.use(express.json({limit : "50MB"}))  // allows us to parse incoming request with json payload
app.use(cors())


app.use("/api/auth", Routes.authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World...')
});


app.listen(Config.port,() => {
    console.log(`App is running on Port ${Config.port}`)
})

const Database_Url = Config.mongoURI || 'mongodb://127.0.0.1:27017'
const Database_Name = Config.dbName || 'auth'

connectDB(Database_Url,Database_Name)