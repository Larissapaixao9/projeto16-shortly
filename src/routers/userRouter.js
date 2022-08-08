import express from "express";
import { logup, signin, getUserData } from '../controllers/userController.js'
const router=express.Router()

router.post('/signup',logup)
router.post('/signin',signin)
router.get('/users/me',getUserData)


export default router