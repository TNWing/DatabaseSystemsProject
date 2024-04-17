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
app.post('/modify', async (req, res) => {//can just use this for insert,update,delete
  // Replace this with the actual data you want to send.
  const data=await sqlModify(req.body);
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