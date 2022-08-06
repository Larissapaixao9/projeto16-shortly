import express from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import connection from '../database.js'
dotenv.config()

export default function authenticateToken(req,res,next){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    
    console.log(token)
    if(token===null){
        return res.send('não existe token').status(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err){
            return res.status(403).send('usuario não tem acesso a essa pagina')
        }
        console.log(req.body)
        
        next()
    })
}