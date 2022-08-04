import express from "express";
import connection from "../database.js";
export async function logup(req,res){
    const { name, email, password, confirmPassword } = req.body;
try {
    // if(!req.body){
    //     res.send('erro na validação do cadastro').status(422)
    // }

    await connection.query(`INSERT INTO users (name, email, password, confirmPassword)
    VALUES ($1,$2,$3,$4)`,[name, email, password, confirmPassword])

    res.sendStatus(201)
} catch (error) {
    res.sendStatus(400)
}
    
}