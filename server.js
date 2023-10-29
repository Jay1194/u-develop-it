//import express at the top of the file
const express = require('express');

//import the module first
const inputCheck = require('./utils/inputCheck');

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
app.get('/api/candidates', (req, res) => {//This route is designated with the endpoint /api/candidates

    //The SQL statement SELECT * FROM candidates is assigned to the sql variable.
    const sql = `SELECT * FROM candidates`;

//callback function will handle the client's request and the database's response.
db.query(sql, (err, rows) => {

    //error-handling conditional.
    if (err) {

        //500 status code indicates a server error
        res.status(500).json({ error: err.message });
        return;
    }
    //If there was no error, then err is null and the response is sent back
    res.json({ 
        message: 'success', 
        data: rows //instead of logging the result, rows, from the database, we'll send this response as a JSON object to the browser, using res in the Express.js route callback
        });
    });
});



//GET a single candidate -  OPERATIONS
app.get('/api/candidate/:id', (req, res) => { //endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database.
    const sql = `SELECT * FROM candidates WHERE id = ?`;

    //In the database call, we'll assign the captured value populated in the req.params object with the key id to params - The database call will then query the candidates table with this id and retrieve the row specified. Because params can be accepted in the database call as an array, params is assigned as an array with a single element, req.params.id.
    const params = [req.params.id];

db.query(sql, params, (err, row ) => {

    //error status code was changed to 400 to notify the client that their request wasn't accepted and to try a different request.
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    //In the route response, we'll send the row back to the client in a JSON object.
    res.json({
        message: 'success',
        data: row
    });
  });
});


//need to use the API endpoint testing application Insomnia
//Delete a candidate - ?) that denotes a placeholder, making this a prepared statement. A prepared statement can execute the same SQL statements repeatedly using different values in place of the placeholder. - hardcoding 1 temporarily to demonstrate how prepared statements work. So this would be the same as saying DELETE FROM candidates WHERE id = 1. - the param argument can be an array that holds multiple values for the multiple placeholders.
app.delete('/api/candidate/:id', (req, res) => { //must use the HTTP request method delete() - The endpoint used here also includes a route parameter to uniquely identify the candidate to remove

    //using a prepared SQL statement with a placeholder
    const sql = `DELETE FROM candidates WHERE id = ?`;

    //assign the req.params.id to params
    const params = [req.params.id];

db.query(sql, params, (err, result) => {
    if (err) {
        res.statusMessage(400).json({ error: res.message });

        //if the user tries to delete a candidate that doesn't exist
    } else if (!result.affectedRows) {
        res.json({
            message: 'Candidate not found'
        });

    //JSON object route response will be the message "deleted",changes property set to result.affectedRows
    } else {
        res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
        });
    }
});
});


//Create a candidate -  HTTP request method post() to insert a candidate into the candidates table. We'll use the endpoint /api/candidate
app.post('/api/candidate', ({ body }, res) => { //callback function, we'll use the object req.body to populate the candidate's data. Notice that we're using object destructuring to pull the body property out of the request object

    //inputCheck module was provided by a helpful U Develop It member. We'll use this module to verify that user info in the request can create a candidate.
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');

    //if the inputCheck() function returns an error, an error message is returned to the client as a 400 status code, to prompt for a different user request with a JSON object that contains the reasons for the errors
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

// Create Query for Create Operation - no column for the id. MySQL will autogenerate the id and relieve us of the responsibility to know which id is available to populate.
//In the SQL command we use the INSERT INTO command for the candidates table to add the values that are assigned to params. The four placeholders must match the four values in params, so we must use an array.
const sql = `INSERT INTO candidates ( first_name, last_name, industry_connected)
VALUES (?,?,?)`;

//Because the candidates table includes four columns—id, first_name, last_name, and industry_connected—we need four placeholders (?) for those four values. The values in the params array must match the order of those placeholders
const params = [body.first_name, body.last_name, body.industry_connected];

//query() method, we can execute the prepared SQL statement. 
db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message});
        return;
    }
    
    //We send the response using the res.json() method with a success message and the user data that was used to create the new data entry.
    res.json({
        message: 'success',
        data: body
    });
});
});
/*We'll need to use Insomnia to test this API endpoint, to use the HTTP request POST option.
 Add the API endpoint, http://localhost:3001/api/candidateLinks to an external site., and select POST in the drop-down menu of HTTP request methods.
Before selecting Send, we must populate the body with the candidate information.
 Select the JSON tab underneath the address bar so that we can send the candidate's information as a JSON object. 
 Let's add Ronald Firbank back into the candidates table and restore his candidacy.*/ 

/*
How can we check Ronald's new id? We can either use the browser and navigate to http://localhost:3001/api/candidatesLinks to an external site.
 or we can use Insomnia to send a GET request to http://localhost:3001/api/candidatesLinks to an external site..
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