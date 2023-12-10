const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const dataBase = require('./data.json')
const { v4: uuidv4 } = require('uuid')

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


app.post('/add-entry',(req,res)=> {
    let fields = req.body
    
    let [year,month,day] = fields.date.split('-')

    let id = uuidv4()
    fields.id = id
    if(dataBase[year]) {
        if(dataBase[year][month]) {
            dataBase[year][month][id] = fields
        } else {
            dataBase[year][month] = {id:fields}
        }
    } else {
        dataBase[year] = {}
    }
    console.log(dataBase)
    fs.writeFileSync('./data.json',JSON.stringify(dataBase),(err) => {
        if(err){
            console.log(err)
            return
        }
        console.log(JSON.stringify(dataBase))
    })
    res.status(200).json({id: id})
})

app.post('/delete',(req,res)=> {
    let reqBody = req.body
    delete dataBase[reqBody.year][reqBody.month][reqBody.id]
    fs.writeFileSync('./data.json',JSON.stringify(dataBase),(err) => {
        if(err){
            console.log(err)
            return
        }
    })
    res.status(200).json({message : "successful"})
})



app.listen(port,() => console.log(`server running in ${port}`))