// npm init -y
// npm install pg 
import pg from 'pg';
const { Client } = pg;


const clientO = new Client({
    host: "192.168.0.213",
    user: "postgres",
    port: 5432,
    password: "JCOLLETTE",
    database: "postgres"
});
const client=new Client({
    host:"raja.db.elephantsql.com",
    user:"imbydddg",
    port:5432,
    password:"ePk7Zq0YXRLl2cqqBVceOkPYnQgXaO5w",
    database:"imbydddg"
});


async function connectToDatabase() {
    try {
        // Connect to the PostgreSQL database
        await client.connect();
        console.log('Connected to PostgreSQL database');

        // Execute a sample query
        const query = 'SELECT * FROM Pet';
        const result = await client.query(query);
        console.log('Query results:', result.rows);
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
    } finally {
        // Close the client connection
        await client.end();
        console.log('Connection to PostgreSQL closed');
    }
}

// Call the function to connect to the database
connectToDatabase();

// client.on('error', (err, client) => {
//     console.error('Unexpected error on idle client', err);
//     process.exit(-1);
// });

// client.connect()

// client.query(`Select * from users`, (err, res) => {
//     if(!err){
//         console.log(res.rows);
//     } else {
//         console.log(err.message);
//     }
//     client.end;
// })

// to test: node databasepg.js
// Creating an API https://www.youtube.com/watch?v=HO5iiDaZO2E