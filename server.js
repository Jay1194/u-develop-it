const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const db = require('./db/connection');

//Add the PORT designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

//Add the Express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

//handle user request not supported by the app - Default response for any other request (Not Found)  ----------always last route!!!!
app.use((req, res) => {
    res.status(404).end();
});

//start the Express.js server on port 3001 after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
});
// local host port connection into the address bar: http://localhost:3001



