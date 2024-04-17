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
app.post('/insert', (req, res) => {
  // Replace this with the actual data you want to send.
  const data=sqlInsert(req.body);
  res.send(data);
});
app.post('/modify', (req, res) => {//can just use this for insert,update,delete
  // Replace this with the actual data you want to send.
  const data=sqlModify(req.body);
  res.send(data);
});
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/users/register', (req, res) => {
    res.render('register')
});

app.get('/users/login', (req, res) => {
    res.render('login')
});

app.get('/users/dashboard', (req, res) => {
    res.render('dashboard', {user: "Dante"})
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


// Define endpoint to handle donation form submission
app.post('/donate', async (req, res) => {
  // Extract data from the request body
  const { organization, amount, userid } = req.body;
console.log("TEST");
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
    const result = await pool.query('SELECT pname FROM pets');
    const petNames = result.rows.map(row => row.pname);
    res.json({ petNames });
  } catch (error) {
    console.error('Error fetching pets', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define endpoint to fetch the user's pet name with hardcoded user ID
app.get('/adopt/:userid', async (req, res) => {
  const userid = 'user001'; // Hardcoded user ID

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
    const result = await pool.query('SELECT fname, lname FROM users WHERE userid = $1', [userid]);
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



// Define endpoint to handle donation form submission
app.post('/donate', async (req, res) => {
  // Extract data from the request body
  const { organization, amount, userid } = req.body;

  try {
    // Fetch the orgid based on the selected organization name
    const orgResult = await pool.query(
      `SELECT org_id FROM organization WHERE name = $1`,
      [organization]
    );

    // Check if organization exists
    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const orgid = orgResult.rows[0].id;

    // Log the data before inserting into the database
    console.log('Data to be inserted into donate table:', { userid, orgid, amount });

    // Perform SQL insert operation to add donation information to the database
    const result = await pool.query(
      `INSERT INTO donate (userid, org_id, amount) VALUES ($1, $2, $3)`,
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






