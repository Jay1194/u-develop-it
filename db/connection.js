const mysql = require('mysql2');


//connect the application to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'Jay1194!@',
  database: 'election'
});

module.exports = db;