import express from "express";
import connection from "../database.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import Joi from "joi";
//no terminal: digitar Node e depois =>
// require('crypto').randomBytes(64).toString('hex')

const schema_for_logup = Joi.object({
    name:Joi.string().required().trim(),
    email:Joi.string().email().required().trim(),
    password:Joi.string().required().trim(),
    confirmPassword:Joi.string().required().trim()
})


const schema_for_login = Joi.object({
    email:Joi.string().email().required().trim(),
    password:Joi.string().required().trim()
})

export async function logup(req,res){
    const { name, email, password, confirmPassword } = req.body;
    const validation = schema_for_logup.validate(req.body);
    const { error } = validation;
    if(error){
        return res.status(422).send(error)
    }
try {
    console.log(req.body)
    const findUser = await connection.query(`SELECT email FROM users WHERE email=$1`,[email])
    if(findUser.rows.length>0){
        return res.sendStatus(409)
    }
    //verifica se as senhas digitadas são iguais
    if(password!=confirmPassword){
        return res.sendStatus(400)
    }
    //criptografa senha
    const cryptedPassword = bcrypt.hashSync(password,10);


    await connection.query(`INSERT INTO users (name, email, password, confirmPassword)
    VALUES ($1,$2,$3,$4)`,[name, email, cryptedPassword, cryptedPassword])
    
    return res.sendStatus(201)

} catch (error) {
    console.log(error)
     res.sendStatus(400)
}   
}

export async function signin(req,res){
    const { email, password } = req.body;
    const validation = schema_for_login.validate(req.body);
    const { error } = validation;
    if(error){
        return res.status(422).send(error)
    }
    try {
        
        const findUser = await connection.query(`SELECT email,id,password FROM users WHERE email=$1`,[email])

        if(findUser.rowCount===0){
            return res.status(401).send('usuario nao encontrado');
        }

        const verifyPassword = bcrypt.compareSync(password,findUser.rows[0].password)
       
        console.log(findUser.rows[0].password)
        // console.log(findUser.rows)
        console.log(password)
         console.log(verifyPassword)
   

        if(!verifyPassword){
            return res.sendStatus(401)
        }

        const user = {
            email,
            password
        }
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
        
        console.log(findUser)
        connection.query(`INSERT INTO sessions (user_id,token) VALUES ($1,$2)`,[findUser.rows[0].id,accessToken])
        return res.send({accessToken}).status(200)
    } catch (error) {
        return res.send(error).status(400)
    }
}

export async function getUserData(req,res){
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
    })

    const search_for_user = await connection.query(`SELECT user_id FROM sessions WHERE token=$1`,[token])

    if(search_for_user.rowCount===0){
        return res.sendStatus(401);
    }

    const { user_id } = search_for_user.rows[0]
    console.log(user_id);

    const get_all_user_infos = await connection.query(`SELECT users.id, users.name, SUM(count) AS "visitCount" FROM users JOIN urls2 ON users.id=urls2.user_id WHERE users.id=$1 GROUP BY users.id`,[user_id]);

    const user_urls_infos = await connection.query(`SELECT urls2.id, "shortUrl", url, count AS "visitCount" FROM urls2 WHERE user_id=$1`,[user_id])

     console.log(get_all_user_infos.rows[0])
     console.log(user_urls_infos.rows)

     
     const result = {...get_all_user_infos.rows[0], "shortUrl":user_urls_infos.rows}
    return res.status(200).send(result);
}