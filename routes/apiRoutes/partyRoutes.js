const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// GET route for all parties
router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
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

//route that includes an id parameter for a single party
router.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
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

//delete parties
router.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            //check if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
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

//In the preceding statement, the db object is using the query() method. This method runs the SQL query and executes the callback with all the resulting rows that match the query.
//Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response. If there are no errors in the SQL query, the err value is null.
//This method is the key component that allows SQL commands to be written in a Node.js application.

/*We'll need to use Insomnia to test this API endpoint, to use the HTTP request POST option.
 Add the API endpoint, http://localhost:3001/api/candidateLinks to an external site., and select POST in the drop-down menu of HTTP request methods.
Before selecting Send, we must populate the body with the candidate information.
 Select the JSON tab underneath the address bar so that we can send the candidate's information as a JSON object. 
 Let's add Ronald Firbank back into the candidates table and restore his candidacy.*/ 

/*
How can we check Ronald's new id? We can either use the browser and navigate to http://localhost:3001/api/candidatesLinks to an external site.
 or we can use Insomnia to send a GET request to http://localhost:3001/api/candidatesLinks to an external site..
*/