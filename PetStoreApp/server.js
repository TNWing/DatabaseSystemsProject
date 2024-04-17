import './dbConfig.js'
import './databasepg.js'
import { pool } from './dbConfig.js'
import express from 'express';
import cors from 'cors'

const app = express();
import bcrypt from 'bcrypt';
const PORT = 5273;
app.set("view engine", "ejs")
app.set('port',PORT)
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.text())
app.use((req, res, next) => {
    res.header('Content-Type', 'text/plain');
    next();
});
async function sqlSelect(query){
  return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
          if (err) {
              console.error('Error', err);
              reject(err);
          } else {
              resolve(result.rows);
          }
      });
  });
}

async function sqlInsert(query){
    await pool.query(
        query,(err,results)=>{
            if (err) {
              console.error('Error', err);
              return -1;
            } else {
            //result is an arr or list of objs, each obj is a row
                console.log(result);
              return 1;
            }
        }
    )
}

app.listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});


app.post('/select', async (req, res) => {
  // Replace this with the actual data you want to send.
  const data = await sqlSelect(req.body);
  const values = data.map(row => Object.values(row));
  console.log(JSON.stringify(data));
  console.log(values);
  res.send(values);
});

async function sqlModify(query){
  return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
          if (err) {
              console.error('Error', err);
              reject(err);
          } else {
              resolve(1);
          }
      });
  });
}
app.post('/modify', (req, res) => {//can just use this for insert,update,delete
  // Replace this with the actual data you want to send.
  const data=sqlModify(req.body);
  res.send(data);
});
app.get('/', (req, res) => {
    res.render('index')
});

app.post('/register', async (req, res) => {
  try {
    // Parse the JSON data from the request body
    const registerData = JSON.parse(req.body);
    console.log(registerData);

    // Extract user registration data from the parsed JSON object
    const { userID, email, fname, lname, phonenumber, address } = registerData;
    const values = [userID, email, fname, lname, phonenumber, address];
    console.log(values);

    // Perform any necessary data validation here

    // Insert the user data into the database
    const query = `
      INSERT INTO users (userID, email, fname, lname, phonenumber, address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, values);

    // Send success response
    res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    // If registration fails
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

async function checkIfUsernameExists(username) {
  try {
    // Query the database to check if the username exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [username]);
    // If a row with the given username exists, return true; otherwise, return false
    return result.rows.length > 0;
  } catch (error) {
    // Log any errors that occur during the database query
    console.error('Error checking if username exists:', error);
    // Return false in case of an error or if the query fails
    return false;
  }
}

app.get('/checkUsername/:username', async (req, res) => {
  try {
    const username = req.params.username;
    // Query the database to check if the username exists
    const userExists = await checkIfUsernameExists(username);
    // Send JSON response based on whether the username exists or not
    res.json({ exists: userExists });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/resources', async (req, res) => {
  try {
    // Query the database to fetch resources
    const result = await pool.query('SELECT * FROM resources');
    
    // Extract the resources from the query result
    const resources = result.rows;
    console.log(resources)

    // Send the resources as a JSON response
    res.json({ resources });
  } catch (error) {
    // If an error occurs during the database query
    console.error('Error fetching resources:', error);
    // Send an error response to the client
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function deleteResourceFromDB(resourceId) {
  // Define the SQL query to delete the resource
  const query = 'DELETE FROM resources WHERE resourcenum = $1';
  // Execute the query with the resource ID as a parameter
  await pool.query(query, [resourceId]);
}

// Define route handler for deleting a resource
app.delete('/resources/:id', async (req, res) => {
  const resourceId = req.params.id;
  try {
    await deleteResourceFromDB(resourceId);
    // Send success response
    res.status(200).json({ success: true, message: `Resource with ID ${resourceId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resource' });
  }
});

app.put('/empDashboard/:id', async (req, res) => {
  const resourceId = req.params.id;
  const { url } = req.body;
  console.log(resourceId)
  console.log(url)

  try {
    // Update the resource URL in the database
    const updateQuery = 'UPDATE resources SET resourceurl = $1 WHERE resourcenum = $2';
    await pool.query(updateQuery, [url, resourceId]);

    // Respond with success message
    res.status(200).json({ success: true, message: 'Resource URL updated successfully' });
  } catch (error) {
    // Log and respond with error message
    console.error('Error updating resource URL:', error);
    res.status(500).json({ success: false, message: 'Failed to update resource URL' });
  }
});

app.post('/resources/insert', async (req, res) => {
  const { resourceNum, url } = req.body;
  console.log(url)
  try {
    // Insert the resource into the database
    const insertQuery = 'INSERT INTO resources (resourcenum, resourceurl) VALUES ($1, $2)';
    await pool.query(insertQuery, [resourceNum, url]);

    // Respond with success message
    res.status(200).json({ success: true, message: 'Resource inserted successfully' });
  } catch (error) {
    console.error('Error inserting resource:', error);
    res.status(500).json({ success: false, message: 'Failed to insert resource' });
  }
});

