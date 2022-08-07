import express from "express";
import connection from '../database.js'

export async function getRanking(req,res){

    const get_users_urls = await connection.query('SELECT users.id, users.name, COUNT(urls2.user_id) AS "linkCount", SUM(urls2.count) AS "visitCount" FROM users JOIN urls2 ON urls2.user_id = users.id GROUP BY urls2.user_id,users.id ORDER BY "visitCount" DESC LIMIT 10');

    console.log(get_users_urls.rows)

    res.status(200).send(get_users_urls.rows)
}