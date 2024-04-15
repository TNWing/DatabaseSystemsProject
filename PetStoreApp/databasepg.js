// npm init -y
// npm install pg 
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
const { Client } = pg;

const client=new Client({
    host:"raja.db.elephantsql.com",
    user:"imbydddg",
    // port:5174,
    port:5173,
    password:"ePk7Zq0YXRLl2cqqBVceOkPYnQgXaO5w",
    database:"imbydddg"
});

const app = express();
const port = 5175;

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

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { name, contact_info, address, date_of_birth, organization, task } = req.body;

    // Insert into the people table
    const peopleQuery = `
      INSERT INTO people (name, contact_info, address, date_of_birth)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id
    `;
    const peopleValues = [name, contact_info, address, date_of_birth];
    const { rows: peopleRows } = await pool.query(peopleQuery, peopleValues);
    const userId = peopleRows[0].user_id;

    // Insert into the volunteer table
    const volunteerQuery = `
      INSERT INTO volunteer (user_id, organization_id, task)
      VALUES ($1, $2, $3)
    `;
    const volunteerValues = [userId, organization, task];
    await pool.query(volunteerQuery, volunteerValues);

    res.send('Form submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});