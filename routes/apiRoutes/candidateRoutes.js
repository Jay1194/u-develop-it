const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all candidates and their party affiliation
router.get('/candidates', (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get single candidate with party affiliation
router.get('/candidate/:id', (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON candidates.party_id = parties.id 
               WHERE candidates.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create a candidate
router.post('/candidate', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
    'industry_connected'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected, party_id) VALUES (?,?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.industry_connected,
    body.party_id
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Update a candidate's party
router.put('/candidate/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete a candidate
router.delete('/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;


/*
//query the database to test the connection - gets all candidates OPERATIONS
app.get('/api/candidates', (req, res) => {//This route is designated with the endpoint /api/candidates

    //The SQL statement SELECT * FROM candidates is assigned to the sql variable. - (Left JOIN query) for connecting candidates and partys table together!
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;

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

    //(Left JOIN query) for connecting candidates and partys table together!
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;

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
const sql = `INSERT INTO candidates ( first_name, last_name, industry_connected, party_id)
VALUES (?,?,?)`;

//Because the candidates table includes four columns—id, first_name, last_name, and industry_connected—we need four placeholders (?) for those four values. The values in the params array must match the order of those placeholders
const params = [body.first_name, body.last_name, body.industry_connected, body.party_id];

//query() method, we can execute the prepared SQL statement. 
db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message});
        return;
    }
    
    //We send the response using the res.json() method with a success message and the user data that was used to create the new data entry.
    res.json({
        message: 'success',
        data: body,
        changes: result.affectedRows
    });
  });
});

// Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }

    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success candidate updated!',
          data: req.body,
          changes: result.affectedRows
        });
      }
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

*/