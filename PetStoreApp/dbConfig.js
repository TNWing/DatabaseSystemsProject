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

const createDB= "CREATE DATABASE PetAdoption "+
                   "WITH "+
                   "OWNER = postgres "+
                   "ENCODING = 'UTF8' "+
                   "LC_COLLATE = 'English_United States.1252' "+
                   "LC_CTYPE = 'English_United States.1252' "+
                   "TABLESPACE = pg_default "+
                   "CONNECTION LIMIT = -1 "+
                   "TEMPLATE = template0;";
const createBreedTable="CREATE TABLE Breeds (breed_id INT PRIMARY KEY,bname VARCHAR(255),btype VARCHAR(255))";
const createPetTable="CREATE TABLE Pets ("+
                          "pet_id INT PRIMARY KEY,"+
                          "pname VARCHAR(255),"+
                          "species VARCHAR(255),"+
                          "breed_id INT,"+
                          "age INT,"+
                          "description TEXT,"+
                          "FOREIGN KEY (breed_id) REFERENCES Breeds(breed_id))";
const checkBreeds="SELECT * From Breeds";


const newBreed="INSERT INTO Breeds Values (1, 'Beagle', 'Dog')";
const delBeagle="DELETE FROM Breeds WHERE breed_id=1";

pool.query(
   createBreedTable, (err,result)=>{
        if (err) {
          console.error('Error creating the breeds table', err);
        } else {
          console.log('Users table created successfully');
        }
      }
);
pool.query(
   createPetTable, (err,result)=>{
        if (err) {
          console.error('Error creating the pet table', err);
        } else {
          console.log('Users table created successfully');
        }
      }
);


pool.query(
   newBreed, (err,result)=>{
        if (err) {
          console.error('Error creating the users table', err);
        } else {
          console.log('New Breed');
        }
      }
);

/*
pool.query(
   delBeagle, (err,result)=>{
        if (err) {
          console.error('Error creating the users table', err);
        } else {
          console.log("DELETED BEAGLE");
        }
      }
);

async function runQueries() {
  try {
    let result = await pool.query(createBreedTable);
    console.log('Users table created successfully');

    result = await pool.query(createPetTable);
    console.log('Users table created successfully');

    result = await pool.query(checkBreeds);
    console.log(result);

    result = await pool.query(newBreed);
    console.log('New Breed');

    result = await pool.query(checkBreeds);
    console.log(result);

    result = await pool.query(delBeagle);
    console.log("DELETED BEAGLE");

    result = await pool.query(checkBreeds);
    console.log(result);
  } catch (err) {
    console.error('Error executing query', err);
  }
}

runQueries();

*/