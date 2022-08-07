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

export async function redirectUrl(req,res){
    const short_url = req.params.shortUrl;
    if(!short_url){
        return res.sendStatus(404);
    }
    console.log(short_url);

    const get_url_from_shortUrl = await connection.query(`SELECT url FROM urls2 WHERE "shortUrl"=$1`,[short_url]);

    if(get_url_from_shortUrl.rowCount===0){
        return res.status(404).send('a url encurtada nao existe')
    }


    if(get_url_from_shortUrl.rowCount>0){
       console.log('url encurtada existe')
    }
    
    const url_tobe_redirected=get_url_from_shortUrl.rows[0].url;
    console.log(url_tobe_redirected);
    
    await connection.query(`UPDATE urls2 SET count=count+1 WHERE url=$1`,[url_tobe_redirected])
    return res.redirect(url_tobe_redirected)
}

export async function deleteShortUrl(req,res){
    const id = parseInt(req.params.id);
    console.log(id);

    if(!id){
        return res.sendStatus(400)
    }

    const user_from_sessions = await connection.query('SELECT * FROM sessions ORDER BY ID DESC LIMIT 1'
    )
    console.log(user_from_sessions.rows[0])

    const get_url_shotendUrl = await connection.query(`SELECT user_id FROM urls2 WHERE id=$1`,[id]);


    if(user_from_sessions.rows[0].user_id!=get_url_shotendUrl.rows[0].user_id){
        console.log(user_from_sessions.rows[0].user_id)
        console.log(get_url_shotendUrl.rows[0].user_id)
        return res.status(401).send('a url não é do usuario')
    }
    else{
       // connection.query(`DELETE `)
       connection.query(`DELETE FROM urls2 WHERE id=$1`,[id])
    }
     return res.sendStatus(201)
}
