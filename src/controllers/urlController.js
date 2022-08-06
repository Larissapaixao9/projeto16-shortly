import express from "express";
import connection from "../database.js";
import authenticateMiddleware from '../middlewares/authenticateMiddleware.js'
import Joi from "joi";
import  {nanoid}  from "nanoid";
//import { route } from "express/lib/application";
export async function postUrlsShorts(req,res){
    //const {user} = authenticateMiddleware
   const schema = Joi.object({
       url:Joi.string().uri()
   })
    try {
        //validação do formato da url
        const validate_url = schema.validate(req.body);
        const { error } = validate_url;
        if(error){
            return res.status(422).send(error)
        }
        const old_url = req.body;
        
        //trabalhando com nanoid
        req.body=nanoid();
        let new_url = req.body;
        console.log(new_url)
        if(!new_url){
            return res.status(404).send('url encurtada não existe')
        }

        const user_from_sessions = await connection.query('SELECT * FROM sessions ORDER BY ID DESC LIMIT 1'
        )
        console.log(user_from_sessions.rows[0].user_id)
        console.log(old_url.url)

         connection.query(`INSERT INTO urls2 (url, "shortUrl", user_id, user_token) VALUES($1,$2,$3,$4)`,[old_url.url,new_url,user_from_sessions.rows[0].user_id, user_from_sessions.rows[0].token])
        const the_shortUrl={
            shortUrl:req.body
        }
        
        return res.status(201).send(the_shortUrl)

    } catch (error) {
        return res.sendStatus(400)
    }
}

export async function getUrlByParams (req,res){
    const id = parseInt(req.params.id)
    
    if(!id){
        return res.status(404).send('digite um id valido')
    }

    const get_url_shotendUrl = await connection.query(`SELECT id,url, "shortUrl" FROM urls2 WHERE id=$1`,[id]);
    console.log(get_url_shotendUrl)
    res.send(get_url_shotendUrl.rows[0])
}

// {
//     "email":"e@e.com",
//     "password":"e"
// }