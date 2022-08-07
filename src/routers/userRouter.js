import express from "express";
import { logup, signin, getUserData } from '../controllers/userController.js'
const router=express.Router()

router.post('/logup',logup)
router.post('/login',signin)
router.get('/users/me',getUserData)


export default router