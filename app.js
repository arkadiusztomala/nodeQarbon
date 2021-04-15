const uWS = require('uwebsockets.js')
//const pgPromise = require('pg-promise')
const express = require('express')
const app = express()
const db = require('./db/db')

app.use(express.json());  //express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app. use(express


const port = 3000


// endpoints

// auth/register/
const userRegister = require('./views/register')


// /auth/login

// /todo/get
app.get('/todo/get/:id', (req, res) => {
    const id = parseInt(req.params.id)
    db.query('SELECT * FROM todo WHERE id = $1', [id])
        .then(data => {
            if (data.length === 0) {
                res.status(404).send('Todo doesnt exist.')
                return
            }
            res.status(200).json(data)    
        })
        .catch(error => {
            throw error
        })
})

// /todo/list
app.get('/todo/list', (req, res) => {
    db.query('SELECT * FROM todo')
        .then((data) => {
            res.status(200).json(data)    
        })
        .catch((error) => {
            throw error
        })
})

// /todo/add
app.post('/todo/add', (req, res) => {
        const { description } = req.body;
        db.query('INSERT INTO todo (description) VALUES ($1)', [description])
        .then((data) => {
            res.status(201).send("Todo has been added.")
        })
        .catch((error) => {
            throw error
        })
})

// /todo/delete
app.delete('/todo/delete/:id', (req, res) => {
    const id = parseInt(req.params.id)
    db.query('DELETE FROM todo WHERE id = $1', [id])
        .then((data) => {
            res.status(200).send('Todo has been deleted.')
        })
        .catch((error) => {
            throw error
        })
})


// /todo/update
app.post('/todo/update/:id', (req, res) => {
    const { description } = req.body;
    const id = parseInt(req.params.id)
    db.query('UPDATE todo SET description = $1 WHERE id = $2', [description, id])
        .then((data) => {
            res.status(200).send("Todo has been updated.")
        })
        .catch((error) => {
            throw error
        })
})


// /todo/status
app.post('/todo/status/:id', (req, res) => {
    const { done } = req.body;
    const id = parseInt(req.params.id)
    db.query('UPDATE todo SET done = $1 WHERE id = $2', [done, id])
        .then((data) => {
            res.status(200).send("Todo status has been changed.")
        })
        .catch((error) => {
            throw error
        })
})    


app.listen(port, () => {
    console.log("Server is running on port 3000")
})


// POST wyslac

//!!!!!!!!!!!!!!!!!!!!
// To start the service, type: sudo service postgresql start
// To conntect to postgres, type: sudo -u postgres psql
