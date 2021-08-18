const express = require ('express')
const app = express()
const mysql = require('mysql2')
const parse = require('body-parser')
var auth = require('./routes/auth/auth');
var user = require('./routes/user/users');
var todo = require('./routes/todos/todos');
require ('dotenv').config()

const port = process.env.MYSQL_PORT
app.use(parse.json())
app.use("/", auth);
app.use("/", todo);
app.use("/", user);

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

app.get('/', (req, res) => {
    res.json("Welcome to Epytodo!");
})

app.get('*', function(req, res) {
    res.status(404).send({msg : "Not found"});
});

app.listen(port, () => {
    console.log(`Exemple app listening http://localhost:${port}`)
})