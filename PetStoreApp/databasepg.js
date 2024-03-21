// npm init -y
// npm install pg 

const { Client } = require('pg')

const client = new Client ({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "rootUser",
    database: "postgres"
})

module.exports = client

client.connect()

client.query(`Select * from users`, (err, res) => {
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})

// node databasepg.js
// Creating an API https://www.youtube.com/watch?v=HO5iiDaZO2E