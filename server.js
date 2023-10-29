//import express at the top of the file
const express = require('express');

// import the mysql2 package
const mysql = require('mysql2');

//Add the PORT designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

//Add the Express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect the application to the MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',

        //Your MYSQL username,
        user: 'root',

        //Your MYSQL password
        password: 'Jay1194!@',
        database: 'election'
    },

    console.log('Connected to the election database.')
);

//In the preceding statement, the db object is using the query() method. This method runs the SQL query and executes the callback with all the resulting rows that match the query.
//Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response. If there are no errors in the SQL query, the err value is null.
//This method is the key component that allows SQL commands to be written in a Node.js application.
//query the database to test the connection - gets all candidates OPERATIONS
/*db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});
*/

/*
//GET a single candidate - hardcoded OPERATIONS
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row ) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
})
*/
//Delete a candidate - ?) that denotes a placeholder, making this a prepared statement. A prepared statement can execute the same SQL statements repeatedly using different values in place of the placeholder. - hardcoding 1 temporarily to demonstrate how prepared statements work. So this would be the same as saying DELETE FROM candidates WHERE id = 1. - the param argument can be an array that holds multiple values for the multiple placeholders.
/*db.query(`DELETE FROM candidates WHERE id =?`, 1, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});
*/


/*
// Create Query for Create Operation
//In the SQL command we use the INSERT INTO command for the candidates table to add the values that are assigned to params. The four placeholders must match the four values in params, so we must use an array.
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
VALUES (?,?,?,?)`;

//Because the candidates table includes four columns—id, first_name, last_name, and industry_connected—we need four placeholders (?) for those four values. The values in the params array must match the order of those placeholders
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err) ;
        }
        console.log(result);
})
*/

//handle user request not supported by the app - Default response for any other request (Not Found)  ----------always last route!!!!
app.use((req, res) => {
    res.status(404).end();
});

//start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

// local host port connection into the address bar: http://localhost:3001