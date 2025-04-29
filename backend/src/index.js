import express from 'express'
import dotenv from 'dotenv'
import  {connectDB} from './lib/db.js'
import authRoutes from "./routes/auth.route.js";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import eventRoutes from './routes/event.route.js'
const app=express()
dotenv.config()
const PORT=process.env.PORT

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(cookieParser()) 
app.use(express.json())
app.use("/api/auth", authRoutes);
app.use("/api/events",eventRoutes)
app.listen(PORT,()=>{
    console.log("Serever is UP:"+PORT)
    connectDB()
})