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

// /todo/list
app.get('/todo')

// /todo/add

// /todo/delete

// /todo/update


app.listen(port, () => {
    console.log("Server is running on port 3000")
})


// POST wyslac
