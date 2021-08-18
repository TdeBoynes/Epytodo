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

var TokenIsValid = require('../../middleware/auth')

router.get('/user/:info', TokenIsValid, (req, res) => {
  req.header('Content-Type', 'application/json')
  let nbr = Number(req.params.info);
  let token = req.headers.authorization.split(' ')[1];
  token = jwt.verify(token, process.env.SECRET);
  if (Number.isInteger(nbr)) {
    connection.query('SELECT * FROM user WHERE id = (?);', req.params.info, function (err, results) {
    res.send(results[0])
    });
  } else {
      connection.query('SELECT * FROM user WHERE email = (?);', (req.params.info), function (err, results) {
        res.send(results[0])
    });
  }
});

router.delete('/user/:id', TokenIsValid, (req, res) => {
  req.header('Content-Type', 'application/json')
  connection.query('DELETE FROM user WHERE id = (?);', req.params.id, function (err, results) {
    res.send({msg : "succesfully deleted record number : " + req.params.id}, null, 2);
  });
});

router.get('/user', TokenIsValid, (req, res) => {
  connection.query('SELECT * FROM user;', function (err, results) {
    res.send(results)
  });
});

router.put('/user/:id', TokenIsValid, (req, res) => {
  var obj = req.body;
  var upData = {
      _firstname: obj.firstname,
      _name: obj.name, 
      _email: obj.email,
      _password: obj.password,
  }
  connection.query("UPDATE user SET email = (?), password = (?), name = (?), firstname = (?) WHERE id = (?);", 
    [upData._email, upData._password, upData._firstname, upData._name, req.params.id], function (err, results) {
      connection.query('SELECT * FROM user WHERE id = (?);', req.params.id, function (err, results) {
        var newData = {
          id: results[0].id,
          email: results[0].email,
          password: results[0].password,
          created_at: results[0].created_at,
          firstname: results[0].firstname,
          name: results[0].name, 
        }
        res.send(newData)
      });
    });
});

router.get('/user/*', function(req, res){
  res.status(404).send({msg : "Not found"});
});

module.exports = router;