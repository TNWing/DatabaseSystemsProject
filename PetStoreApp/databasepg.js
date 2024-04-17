// npm init -y
// npm install pg 
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
const { Client } = pg;

const client=new Client({
    host:"raja.db.elephantsql.com",
    user:"imbydddg",
    port:5373,
    port:5174,
    password:"ePk7Zq0YXRLl2cqqBVceOkPYnQgXaO5w",
    database:"imbydddg"
});

const app = express();
const port = 5175;

