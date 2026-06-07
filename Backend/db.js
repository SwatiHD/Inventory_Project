const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Shanthika@12345",
  database: "inventory_db",
});

module.exports = db.promise();
