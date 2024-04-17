import * as express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import morgan from 'morgan';
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgressql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    //connectionString: isProduction ? process.env.DB_DATABASE_URL : connectionString
    idleTimeoutMillis: 0,
    connectionString: 'postgres://imbydddg:ePk7Zq0YXRLl2cqqBVceOkPYnQgXaO5w@raja.db.elephantsql.com/imbydddg'
});

pool.connect((err, client, done) => {
  if (err) {

    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});
/*
use await before each query
*/
const port = process.env.PORT || 5174;
//https://github.com/vitejs/vite/discussions/3396
export {pool};
