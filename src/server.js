import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userouters from './routers/userRouter.js'
import urlsrouters from './routers/urlRouter.js'

dotenv.config()

const app=express();
app.use(express.json())
app.use(cors())
app.use(userouters)
app.use(urlsrouters)

app.get('/home',(req,res)=>{
    res.send('funcionando')
})



const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log('servidor funcionando'))

//https://projetoshortly.herokuapp.com