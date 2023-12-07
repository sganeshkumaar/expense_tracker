const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const dataBase = require('./data.json')

const app= express()
const port= 3000

app.use(express.static(__dirname))
app.use(bodyParser.json())

app.get('/get-month',(req,res) => {
    let query = req.query
    console.log(query)
    let body = {}
    if(dataBase[query.year]) {
        if(dataBase[query.year][query.month]) {
            body = dataBase[query.year][query.month]
        }
    }
    console.log(body)
    res.status(200).json(body)
})

app.listen(port,() => console.log(`server running in ${port}`))