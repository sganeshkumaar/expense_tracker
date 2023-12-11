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
    let body = {}
    if(dataBase[query.year]) {
        if(dataBase[query.year][query.month]) {
            body.monthData = dataBase[query.year][query.month]
        }
    }
    body.ex = dataBase.ex
    body.in = dataBase.in
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
            dataBase[year][month] = {}
            dataBase[year][month][id] = fields
        }
    } else {
        dataBase[year] = {}
        dataBase[year][month] = {}
        dataBase[year][month][id] = fields
    }

    if(dataBase[year][month][fields.entryType]) {
        dataBase[year][month][fields.entryType] += fields.amount 
    } else {
        dataBase[year][month][fields.entryType] = fields.amount
    }
    dataBase[fields.entryType] += fields.amount

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
    let amount = dataBase[reqBody.year][reqBody.month][reqBody.id].amount
    if (dataBase[reqBody.year][reqBody.month][reqBody.id].entryType === 'in') {

        dataBase[reqBody.year][reqBody.month].in -= amount
        dataBase.in -= amount
    } else {
        dataBase[reqBody.year][reqBody.month].ex -= amount
        dataBase.ex -= amount
    }

    delete dataBase[reqBody.year][reqBody.month][reqBody.id]

    fs.writeFileSync('./data.json',JSON.stringify(dataBase),(err) => {
        if(err){
            console.log(err)
            return
        }
    })
    res.status(200).json({message : "successful"})
})


app.post('/update', (req,res) => {
    const query = req.body
    let prevYear = query.prevDate.split('-')[0]
    let prevMonth = query.prevDate.split('-')[1]
    let id = query.id

    let amount = dataBase[prevYear][prevMonth][id].amount
    if (dataBase[prevYear][prevMonth][id].entryType === 'in') {
        dataBase[prevYear][prevMonth].in -= amount
        dataBase.in -= amount
    } else {
        dataBase[prevYear][prevMonth].ex -= amount
        dataBase.ex -= amount
    }

    delete dataBase[prevYear][prevMonth][id]

    let [year,month,day] = query.date.split('-')

    let entry = {}
    
    entry.id = id
    entry.category = query.category
    entry.entryType = query.entryType
    entry.amount = query.amount
    entry.date= query.date

    if(dataBase[year]) {
        if(dataBase[year][month]) {
            dataBase[year][month][id] = entry
        } else {
            dataBase[year][month] = {}
            dataBase[year][month][id] = entry
        }
    } else {
        dataBase[year] = {}
        dataBase[year][month] = {}
        dataBase[year][month][id] = entry
    }

    if(dataBase[year][month][entry.entryType]) {
        dataBase[year][month][entry.entryType] += entry.amount 
    } else {
        dataBase[year][month][entry.entryType] = entry.amount
    }
    dataBase[entry.entryType] += entry.amount

    fs.writeFileSync('./data.json',JSON.stringify(dataBase),(err) => {
        if(err){
            console.log(err)
            return
        }
    })
    
    res.status(200).json({message: "successful"})
})



app.listen(port,() => console.log(`server running in ${port}`))