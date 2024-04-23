import './dbConfig.js'
import './databasepg.js'
import { pool } from './dbConfig.js'
import express from 'express';
import session from 'express-session';
import cors from 'cors';
const app = express();
// import bcrypt from 'bcrypt';
const PORT = 5273;
app.set("view engine", "ejs")
app.set('port',PORT)
app.use(cors({credentials:true,origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    // res.header('Content-Type', 'text/plain');
    next();
});
app.use(session({
    secret: 'Oo6iCFWGj7Ip3GAjphCa2FFkm',
    resave: false,
    saveUninitialized: true,

    cookie: { secure: false,sameSite:'lax'}
}));
async function sqlSelect(query){
        //console.log("OUR QUERY IS THIS " + query);
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


/*
    req.session.user={
        username:userDetails.Username
    }
*/
app.post('/modify', async (req, res) => {//can just use this for insert,update,delete
  // Replace this with the actual data you want to send.
  const data=await sqlModify(req.body);
  res.send(data);
});
app.get('/get-user', function(req, res){
    console.log("IS USER LG");
    console.log(req.session.user);
   if(req.session.user){
      res.send({ user: req.session.user });
   } else {
      res.send({ user: null });
   }
});

app.get('/', (req, res) => {
    res.render('index')
});

/*anytime the server receives a request from the user
the server can use req.session.user to get the user session id (this can be anything we want like email or the actual userID
and we can wrap actions only for logged in users in:
if (req.session.user){};
*/

app.post('/login', async (req, res) => {
  let userDetails=JSON.parse(req.body);
  let result=0;//TODO: check and verify user
  if (result){
    req.session.user={
        userID:"TODO",
    }
  }
  else{
    res.send(403,"Invalid Login!");
  }
});

app.post('/register', async (req, res) => {
  try {
    // Parse the JSON data from the request body
    const registerData = JSON.parse(req.body);
    console.log(registerData);

    // Extract user registration data from the parsed JSON object
    const { userID, password, email, fname, lname, phonenumber, address } = registerData;
    
    // Check if the email is already registered
    const emailCheckQuery = `
      SELECT * FROM users WHERE email = $1
    `;
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      // Email already exists in the database
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Insert the user data into the database
    const query = `
      INSERT INTO users (userID, password, email, fname, lname, phonenumber, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [userID, password, email, fname, lname, phonenumber, address];
    await pool.query(query, values);

    // Send success response
    res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    // If registration fails
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});



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

// middleware function to check if the user is logged in, if not --> login
const redirectLogin = (req, res, next) => {
  // Check if user is logged in 
  console.log(req.session.user)
  if (!req.session.user) {
    res.redirect('/')
  } else {
    next();
  }
};

const checkAuth = (req, res, next) => {
  // Check if user is logged in 
  console.log(req.session.user)
  if (req.session.user) {
    res.redirect('/login')
  } else {
    next();
  }
};

// Apply checkAuth middleware to routes that require authentication
app.get('/userDashboard/:userid', redirectLogin, (req, res, next) => {
  // Route handler logic goes here
  res.render('userDashboard', { username: req.user.username });
  console.log(username)
});


// Route for checking user credentials
app.post('/login', checkAuth, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM Users WHERE Email = $1 AND password = $2', [username, password]);
    const userExists = result.rows.length > 0;

    if (userExists) {
      req.session.user = { userID:username };
      console.log("LOG SESS");
      console.log(req.session.user);
    req.session.save(() => {console.log("SAVED");
        res.json({ success: true, message: 'User signed in successfully' });
    });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
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

app.put('/empDashboard/:id', redirectLogin, async (req, res) => {
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

app.post('/logout', redirectLogin, async (req, res) => {
  try {
    // Clear the user's session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ success: false, message: 'Logout failed' });
      }
      console.log('User logged out successfully');
      res.status(200).json({ success: true, message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ success: false, message: 'Logout failed' });
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

// Define endpoint to handle donation form submission
app.post('/donate', async (req, res) => {
  // Extract data from the request body
  const { organization, amount, userid } = req.body;
  try {
      // Fetch the orgid based on the selected organization name
      const orgResult = await pool.query(
          `SELECT orgid FROM organizations WHERE name = $1`,
          [organization]
      );

      // Check if organization exists
      if (orgResult.rows.length === 0) {
          return res.status(404).json({ error: 'Organization not found' });
      }

      const orgid = orgResult.rows[0].id;

      // Log the data before inserting into the database
      console.log('Data to be inserted into donations table:', { userid, orgid, amount });

      // Perform SQL insert operation to add donation information to the database
      const result = await pool.query(
          `INSERT INTO donations (userid, orgid, amount) VALUES ($1, $2, $3)`,
          [userid, orgid, amount]
      );

      // Log the inserted data
      console.log('Donation submitted:', { userid, orgid, amount });

      // Respond with success message
      res.status(200).json({ message: 'Donation submitted successfully' });
  } catch (error) {
      // Handle errors
      console.error('Error submitting donation:', error);
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
  console.log("HELLO un");
    console.log(req.session.user);
    console.log("bye un");
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


