const uWS = require('uwebsockets.js')
const pgPromise = require('pg-promise')
const express = require('express')
const app = express()
const pool = require('./db/db')

app.use(express.json());  //express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app. use(express


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
        const { description } = req.body;
        pool.query('INSERT INTO todo (description) VALUES ($1)', [description], (error, result) => {
        if (error) {
            throw error
        }
        res.status(201).send("Todo has been added.")
    })
})

// /todo/delete
app.delete('/todo/delete/:id', (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM todo WHERE id = $1', [id] , (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send('Todo has been deleted.')
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

//!!!!!!!!!!!!!!!!!!!!
// To start the service, type: sudo service postgresql start
// To conntect to postgres, type: sudo -u postgres psql
