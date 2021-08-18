var express = require('express');
const mysql = require('mysql2');
require ('dotenv').config();
var jwt = require('jsonwebtoken')
var router = express.Router();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

function TokenIsValid(req, res, next) {
  if (req.headers.authorization == undefined) {
      res.status(403).send({ msg : "No token , authorization denied" });
      return;
  }
  let token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) {
        res.status(403).send({ msg : "Token is not valid" });
        return;
    }
    else 
        next();
  });
}

module.exports = TokenIsValid;