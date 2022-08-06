import express from "express";
import { logup, signin } from '../controllers/userController.js'
const router=express.Router()

router.post('/signup',logup)
router.post('/signin',signin)

export default router