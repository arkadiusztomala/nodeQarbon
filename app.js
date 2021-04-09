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
    const id = parseInt(req.params.id)
    pool.query('SELECT * FROM todo WHERE id = $1', [id] , (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length === 0) {
            res.status(404).send('Todo doesnt exist.')
            return
        }
        res.status(200).json(result.rows)
    })
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
        pool.query('INSERT INTO todo (description)', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    })
})

// /todo/delete
app.delete('/todo/delete/:id', (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM todo WHERE id = $1', [id] , (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length === 0) {
            res.status(200).send('Todo has been deleted.')
            return   //a co jesli ID do skasowania w ogole nie bylo "there no such id to delete"
        }
        res.status(200).json(result.rows)
    })
})


// /todo/update
app.post('/todo/update/:id', (req, res) => {
    res.send("details");
})


app.listen(port, () => {
    console.log("Server is running on port 3000")
})


// POST wyslac
