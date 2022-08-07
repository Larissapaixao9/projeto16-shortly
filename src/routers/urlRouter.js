import express from "express";
import authenticateMiddleware from '../middlewares/authenticateMiddleware.js'
import { postUrlsShorts, getUrlByParams, redirectUrl, deleteShortUrl } from '../controllers/urlController.js'
const router=express.Router()

router.post('/urls/shorten',authenticateMiddleware,postUrlsShorts)
router.get('/urls/:id',getUrlByParams)
router.get('/urls/open/:shortUrl',redirectUrl)
router.delete('/urls/:id',authenticateMiddleware,deleteShortUrl)
export default router