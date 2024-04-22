import './dbConfig.js'
import './databasepg.js'
import { pool } from './dbConfig.js'
import express from 'express';
import session from 'express-session';
import cors from 'cors'

const app = express();
// import bcrypt from 'bcrypt';
const PORT = 5273;
app.set("view engine", "ejs")
app.set('port',PORT)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Accept', 'application/json');
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

// app.post('/insert', (req, res) => {
//   // Replace this with the actual data you want to send.
//   const data = await sqlSelect(req.body);
//   const values = data.map(row => Object.values(row));
//   console.log(JSON.stringify(data));
//   console.log(values);
//   res.send(values);
// });


app.post('/modify', async(req, res) => {//can just use this for insert,update,delete
  // Replace this with the actual data you want to send.
  const data=await sqlModify(req.body);
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
    const { userID, password, email, fname, lname, phonenumber, address } = registerData;
    const values = [userID, password, email, fname, lname, phonenumber, address];
    console.log(values);

    // Insert the user data into the database
    const query = `
      INSERT INTO users (userID, password, email, fname, lname, phonenumber, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
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

app.use(session({
  secret: 'Oo6iCFWGj7Ip3GAjphCa2FFkm',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body);
  }
  next();
});

// Route to check if user is logged in
app.get('/checkLoggedIn', (req, res, next) => {
  if (req.session && req.session.user) {
    const { username } = req.session.user;
    res.json({ loggedIn: true, username });
  } else {
    res.json({ loggedIn: false });
  }
});

// Route for checking user credentials
app.post('/checkUser', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userExists = await checkUser(username, password);
    if (userExists) {
      req.session.user = { username };
      console.log(req.session.user)
      res.json({ success: true, message: 'User signed in successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Route for fetching user dashboard
app.get('/userDashboard/:userid', (req, res, next) => {
  if (req.session.user) {
    res.render('userDashboard', { username: req.session.user.username });
  } else {
    res.redirect('/signin');
  }
});

async function checkUser(username, password) {
  try {
    // console.log(username)
    // console.log(password)
    // Query the database to check if the username and password match
    const result = await pool.query('SELECT * FROM Users WHERE Email = $1 AND password = $2', [username, password]);
    // console.log(result)
    // If a row with the given username and password exists, return true; otherwise, return false
    console.log(result.rows.length > 0)
    return result.rows.length > 0;
  } catch (error) {
    // Log any errors that occur during the database query
    console.error('Error checking if user exists:', error);
    // Return false in case of an error or if the query fails
    return false;
  }
}

// app.get('/userDashboard/:userid', (req, res) => {
//   // Check if user session exists
//   if (req.session.user) {
//     // User is signed in, render the user dashboard
//     console.log('User session exists. Rendering userDashboard:', req.session.user);
//     res.render('userDashboard', { username: req.session.user.username });
//   } else {
//     // User is not signed in, redirect to sign-in page or display appropriate message
//     console.log('User session does not exist. Redirecting to signin page.');
//     res.redirect('/signin');
//   }
// });


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
app.post('/users/register', async (req, res) => {
    let { name, email, password, password2 } = req.body;

    console.log({
        name, email, password, password2
    })

    let errors = [];

    if (!name ||!email ||!password ||!password2) {
        errors.push({message: "Please fill all fields"});
    }

    if (password.length < 6) {
        errors.push({message: "Your password must be longer than 6 characters"});
    }

    if (password != password2) {
        errors.push({message: "Passwords do not match"});
    }

    if(errors.length > 0) {
        res.render("register", {errors})
    } else {
        // Form validation passed
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // pool.query(
        //     `SELECT * FROM users WHERE email = $1`,
        //     [email],
        //     (err, results) => {
        //         if (err) {
        //             throw err;
        //         }
        //         console.log(results.rows);
        //         if (results.rows.length > 0){
        //             errors.push({ message: "Email already registered"});
        //             res.render('register', { errors })
        //         }
        //     }
        // )
    }
})

async function sqlSelectOrganizations() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT name FROM organizations', (err, result) => {
      if (err) {
        console.error('Error fetching organizations', err);
        reject(err);
      } else {
        resolve(result.rows.map(row => row.name));
      }
    });
  });
}

app.get('/organizations', async (req, res) => {
  try {
      const result = await pool.query('SELECT name FROM organization');
      const organizations = result.rows.map(row => row.name);
      res.json({ organizations }); 
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/pets', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.pname, pi.imageURL
      FROM pets p 
      JOIN petImage_Belongs pi ON p.petid = pi.petid
    `);
    const petsData = result.rows;
    res.json({ petsData });
  } catch (error) {
    console.error('Error fetching pets with images', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define endpoint to fetch the user's pet name with hardcoded user ID
app.get('/adopt/:userid', async (req, res) => {
  // Hardcoded user ID

  try {
      // Execute the SQL query to fetch the user's pet name
      const result = await pool.query(
          `SELECT u.userid, p.pname
          FROM adopt a
          JOIN pets p ON a.petid = p.petid
          JOIN users u ON a.userid = u.userid
          WHERE u.userid = $1`,
          [userid]
      );
      if (result.rows.length === 0) {
          // If no pet is found for the given user, return a 404 status code
          return res.status(404).json({ error: 'User or pet not found' });
      }

      // Return the user's pet details
      const userPet = result.rows[0];
      console.log(userPet);
      res.json(userPet);
  } catch (error) {
      console.error('Error fetching user\'s pet', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Define endpoint to fetch user details by user ID
app.get('/users/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const result = await pool.query('SELECT fname, lname FROM users WHERE email = $1', [userid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define endpoint to fetch user donations by user ID
app.get('/donations/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    // Fetch user donations along with organization names
    const result = await pool.query(
      `SELECT o.name AS organization, d.amount 
       FROM donate d 
       JOIN organization o ON d.org_id = o.org_id 
       WHERE d.userid = $1`, 
      [userid]
    );
    const donations = result.rows;
    res.json({ donations });
  } catch (error) {
    console.error('Error fetching user donations', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Submit donation endpoint
app.post('/donate', async (req, res) => {
  try {
    // Extract the required fields from the request body
    const { userid, org_id, amount } = req.body;

    // Validate that all required fields are present and have valid values
    if (!userid || !org_id || !amount || isNaN(parseFloat(amount))) {
      console.error('Invalid or missing fields in request body');
      return res.status(400).json({ error: 'Bad Request: Invalid or missing fields' });
    }

    // Assuming 'amount' is a numeric field in your database, convert it to a number
    const donationAmount = parseFloat(amount);

    // Insert the donation record into the database
    const insertQuery = `
      INSERT INTO donate (userid, org_id, amount)
      VALUES ($1, $2, $3)
    `;
    await pool.query(insertQuery, [userid, org_id, donationAmount]);

    // Send success response
    res.status(200).json({ success: true, message: 'Donation submitted successfully' });
  } catch (error) {
    console.error('Error submitting donation:', error);
    res.status(500).json({ success: false, message: 'Failed to submit donation' });
  }
});







app.get('/organizations/:name', async (req, res) => {
  const orgName = req.params.name;

  try {
    // Query the database to fetch the organization ID based on its name
    const result = await pool.query('SELECT org_id FROM organization WHERE name = $1', [orgName]);

    if (result.rows.length === 0) {
      // If no organization is found with the given name, return a 404 status code
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Extract the org_id from the query result and send it in the response
    const orgId = result.rows[0].org_id;
    res.json({ org_id: orgId });
  } catch (error) {
    console.error('Error fetching organization details by name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


