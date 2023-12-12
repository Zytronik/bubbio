const mysql = require('mysql');

let conn;

function setup(){

  // Create a connection to the database
  let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Connect to the database
  conn.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL database as id ' + conn.threadId);
  });

  // Perform database operations here...

  // Close the connection when done
  conn.end();
}

module.exports = { 
    conn: conn,
    setup: setup,
};