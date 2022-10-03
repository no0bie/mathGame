
const mysql = require('mysql')
const db = mysql.createConnection({
host: "<host>",
user: "<user>",
password: "<password>",
database:"<database>" 
})

module.exports = db;