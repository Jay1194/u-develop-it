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

//query the database to test the connection
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

//handle user request not supported by the app - Default response for any other request (Not Found)  ----------always last route!!!!
app.use((req, res) => {
    res.status(404).end();
});

//start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

// local host port connection into the address bar: http://localhost:3001