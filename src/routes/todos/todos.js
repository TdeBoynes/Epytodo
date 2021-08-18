var express = require('express');
const mysql = require('mysql2');
require ('dotenv').config();
var router = express.Router();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

var TokenIsValid = require('../../middleware/auth')

router.get('/todo', TokenIsValid, (req, res) => {
    connection.query('SELECT * FROM todo;', function (err, results) {
        res.send(results)
    });
});

router.get('/user/todos', TokenIsValid, (req, res) => {
    connection.query('SELECT * FROM todo;', function (err, results) {
      res.send(results);
    });
});

router.get('/todo/:id', TokenIsValid, (req, res) => {
    req.header('Content-Type', 'application/json')
    connection.query('SELECT * FROM todo WHERE id = (?);', req.params.id, function (err, results) {
      res.send(results[0])
    });
});

router.delete('/todo/:id', TokenIsValid, (req, res) => {
    req.header('Content-Type', 'application/json')
    connection.query('DELETE FROM todo WHERE id = (?);', req.params.id, function (err, results) {
      res.send({msg : "succesfully deleted record number : " + req.params.id}, null, 2);
    });
});

router.post('/todo', TokenIsValid, (req, res) => {
    var obj = req.body;
    const todoData = {
        title: obj.title,
        description: obj.description, 
        due_time: obj.due_time,
        user_id: obj.user_id,
        status: obj.status
    }
    if (todoData.title == undefined || todoData.description == undefined || todoData.due_time == undefined || todoData.user_id == undefined || todoData.status == undefined)
        res.status(404).send({ msg: "internal server error"});
    else {
      connection.query("INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?,?,?,?,?);", 
      [todoData.title, todoData.description, todoData.due_time, todoData.user_id, todoData.status])
      res.send(todoData);
    }
});

router.put('/todo/:id', TokenIsValid, (req, res) => {
    var obj = req.body; 
    var toUpData = {
        title: obj.title,
        description: obj.description, 
        due_time: obj.due_time,
        user_id: obj.user_id,
        status: obj.status
    }
    connection.query("UPDATE todo SET title = (?), description = (?), due_time = (?), user_id = (?), status = (?) WHERE id = (?);", 
      [toUpData.title, toUpData.description, toUpData.due_time, toUpData.user_id, toUpData.status, req.params.id])
      res.send(toUpData);
  });

router.get('/todo/*', function(req, res){
    res.status(404).send({msg : "Not found"});
});
  
module.exports = router;