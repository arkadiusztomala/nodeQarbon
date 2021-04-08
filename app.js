const uWS = require('uwebsockets.js')
const pgPromise = require('pg-promise')
const express = require('express')
const app = express()
const pool = require('./db/db')

const port = 3000





// endpoints

// auth/register/
const userRegister = require('./views/register')


// /auth/login

// /todo/get
app.get('/todo/get/:id', (req, res) => {
    res.send("details");
})

// /todo/list
app.get('/todo/list', (req, res) => {
    pool.query('SELECT * FROM todo', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    })
})

// /todo/add
app.post('/todo/add', (req, res) => {
    res.send("creating todo");
})

// /todo/delete
app.delete('/todo/delete/:id', (req, res) => {
    res.send("deleting");
})

// /todo/update
app.post('/todo/update/:id', (req, res) => {
    res.send("details");
})


app.listen(port, () => {
    console.log("Server is running on port 3000")
})


// POST wyslac
