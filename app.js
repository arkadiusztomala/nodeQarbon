const uWS = require('uwebsockets.js')
const pgPromise = require('pg-promise')
const express = require('express')
const app = express()

const port = 3000





// endpoints

// auth/register/
const userRegister = require('./views/register')


// /auth/login

// /todo/get
app.get('/todo/:id', (req, res) => {
    res.send("details");
})

// /todo/list
app.get('/todo', (req, res) => {
    res.send("getting todos");
})

// /todo/add
app.post('/todo', (req, res) => {
    res.send("creating todo");
})

// /todo/delete
app.delete('/todo/:id', (req, res) => {
    res.send("deleting");
})

// /todo/update
app.post('/todo/:id', (req, res) => {
    res.send("details");
})


app.listen(port, () => {
    console.log("Server is running on port 3000")
})


// POST wyslac
