import express from "express";
import authenticateMiddleware from '../middlewares/authenticateMiddleware.js'
import { postUrlsShorts, getUrlByParams } from '../controllers/urlController.js'
const router=express.Router()

router.post('/urls/shorten',authenticateMiddleware,postUrlsShorts)
router.get('/urls/:id',getUrlByParams)

export default router