//require("dotenv").config();
require("dotenv").config();
const express = require('express');
const app = express();
const { Pool } = require("pg");
const morgan = require('morgan');
const isProduction = process.env.NODE_ENV === "production";
app.use(morgan('dev'));


const connectionString = `postgressql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    //connectionString: isProduction ? process.env.DB_DATABASE_URL : connectionString
    connectionString: 'postgres://imbydddg:ePk7Zq0YXRLl2cqqBVceOkPYnQgXaO5w@raja.db.elephantsql.com/imbydddg?sslmode=require'
});

pool.connect((err, client, done) => {
  if (err) {

    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});
const port = process.env.PORT || 5173;
app.listen(port,()=>{
    console.log('server is on port ${port}');
});

//https://github.com/vitejs/vite/discussions/3396
module.exports = { pool }
const createDB= "CREATE DATABASE PetAdoption "+
                   "WITH "+
                   "OWNER = postgres "+
                   "ENCODING = 'UTF8' "+
                   "LC_COLLATE = 'English_United States.1252' "+
                   "LC_CTYPE = 'English_United States.1252' "+
                   "TABLESPACE = pg_default "+
                   "CONNECTION LIMIT = -1 "+
                   "TEMPLATE = template0;";

const seeDB="SELECT name FROM sys.databases;";
const checkDB="SELECT * FROM PetAdoption";
pool.query(
   checkDB, (err,result)=>{
        if (err) {
          console.error('Error creating the users table', err);
        } else {
          console.log('Users table created successfully');
        }
      }
);