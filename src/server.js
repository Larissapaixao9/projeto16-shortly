import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app=express();
app.use(express.json())
app.use(cors())



const PORT = process.env.PORT || 3560
app.listen(PORT, ()=>console.log('servidor funcionando'))