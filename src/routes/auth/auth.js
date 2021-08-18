const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
require ('dotenv').config()
const parse = require('body-parser')
var jwt = require('jsonwebtoken')
const router = express.Router()
const salt = 10;
var id = 0;
let nb_User = 0;
router.use(parse.json())

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

function GetId(email, callback) {
    connection.query('SELECT id FROM user WHERE email = (?);', email, function (err, results) {
        id = results;
        callback(results);
    });
}

router.post('/login', (req, res) => {
    var obj = req.body;
    let token;
    const userData = {
        _email: obj.email,
        _password: obj.password,
    }
    if (userData._email == undefined || userData._password == undefined) {
        res.status(404).send({ msg : "internal server error"});
        return;
    }
    connection.query('SELECT password FROM user WHERE email = (?);', userData._email, function (err, results) {
        if (results.length <= 0) {
            res.send({msg: "Invalid Credentials"});
        }
        if (bcrypt.compareSync(userData._password, results[0].password)) {
            token = jwt.sign({userId: id}, process.env.SECRET, { expiresIn: '3600s' });
            res.send(JSON.stringify({token}));
        } else
            res.send({msg: "Invalid Credentials"});
    });
});

router.post('/register', (req, res) => {
    let token;
    var obj = req.body;
    const userData = {
        _firstname: obj.firstname,
        _name: obj.name, 
        _email: obj.email,
        _password: obj.password,
    }
    if (userData._email == undefined || userData._password == undefined || userData._name == undefined || userData._firstname == undefined)
        res.status(404).send({ msg : "internal server error" });
    else {
        connection.query('SELECT email FROM user WHERE email = (?);', userData._email, function (err, results) {
            if (results.length > 0) {
                res.send({msg: "account already exists"});
                return;
            } else {
                userData._password = bcrypt.hashSync(userData._password, 10);
                connection.query("INSERT INTO user (email, password, name, firstname) VALUES (?,?,?,?)",
                [userData._email, userData._password, userData._name, userData._firstname], function (err) {
                        GetId(obj.email, function (err, results) {
                            token = jwt.sign({userId: id}, process.env.SECRET, { expiresIn: '3600s' });
                            res.send(JSON.stringify({token}));
                        });
                    });
            }
        });
    }
});
  

module.exports = router;