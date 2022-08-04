import express from "express";
import { logup } from '../controllers/userController.js'
const router=express.Router()

router.post('/signup',logup)
//router.post('/signin')

export default router