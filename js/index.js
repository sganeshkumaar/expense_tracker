import {validateAmount,yearMonthValidate,validateCategory,validateFields,validateEntryDate,incomeCategories,expenseCategories} from './validate.js'

import {yearMonthSplit,calculatePercentage} from './unit.js'

import {displaySummary,displayTable,optionsFill,displayAnalytics} from './displayFunctions.js'

const monthsInRecord = document.querySelector('#records-portion #month-input')

const addButton = document.querySelector('.add-button')

const cancelButton = document.querySelector('.cancel-button')

const fromInput = document.querySelector('#from-month')
const toInput = document.querySelector('#to-month')

const radioIncome = document.querySelector('#income-option')
const radioExpense = document.querySelector('#expense-option')

const categoryInput =document.querySelector('#category-input')
const amountInput =document.querySelector('#amount-input')
const dateInput =document.querySelector('#date-input')

let idForEdit = ''
let dateForEdit = ''


displaySummarySection()
optionsFill(incomeCategories)
requestAnalytics()

monthsInRecord.addEventListener('change',displaySummarySection)

document.querySelector('#left-arrow').addEventListener('click',leftArrow)
document.querySelector('#right-arrow').addEventListener('click',rightArrow)

document.querySelector('.get-button').addEventListener('click', requestAnalytics)

radioIncome.addEventListener('click',changeOnRadioClick)
radioExpense.addEventListener('click',changeOnRadioClick)

addButton.addEventListener('click',processEntry)

fromInput.addEventListener('change',processAnalyticMonth)
toInput.addEventListener('change',processAnalyticMonth)
cancelButton.addEventListener('click',cancelEntry) 

/**
 * fetches the month data and display the monthly summary and records table
 */
async function displaySummarySection () {

    let [year,month] = yearMonthSplit(monthsInRecord.value)
    month = parseInt(month)
    
    if(!(yearMonthValidate(year,month))) {
        let date = new Date()
        monthsInRecord.value = `${date.getFullYear()}-${date.getMonth()+1}`
        return
    }

    month = month.toString().padStart(2,'0')
    
    let monthSummary = await fetch(`/get-month?year=${year}&month=${month}`).then((res)=> res.json())

    displayTable(monthSummary.monthData)
    displaySummary(monthSummary)
}

/**
 * adding event listeners for edit buttons in the table
 */
export function editButtonListeners() {
    let editButtons = document.querySelectorAll('.edit')
    editButtons.forEach((button) => {
        button.addEventListener('click',editClick)
    });
}

/**
 * things to be done when a particular edit button is clicked
 */
async function editClick() {
    idForEdit = this.parentNode.parentNode.parentNode.id
    dateForEdit = this.nextElementSibling.nextElementSibling.innerHTML
    
    let [date,month,year] = dateForEdit.split('-')
    dateInput.value = `${year}-${month}-${date}`
    dateForEdit = dateInput.value

    categoryInput.value = this.parentNode.parentNode.nextElementSibling.innerText

    amountInput.value = this.parentNode.parentNode.nextElementSibling.nextElementSibling.innerText.split(' ')[1].replace(',', '')

    if(this.parentNode.parentNode.parentNode.classList.contains('ex')) {
        radioExpense.checked = true
    } else {
        radioIncome.checked = true
    }

    cancelButton.classList.remove('none')
    addButton.value = 'update'
}

/**
 * adding event listeners for delete buttons in the table
 */
export function deleteButtonListeners() {
    let deleteButtons = document.querySelectorAll('.delete')
    deleteButtons.forEach((button) => {
        button.addEventListener('click',deleteClick)
    });
}

/**
 * things to be done when a particular delete button is clicked
 */
async function deleteClick() {
    let udi = this.parentNode.parentNode.parentNode.id

    let date = this.parentNode.querySelector('.date').innerText.split('-')
    let body = {
        id: udi,
        month: date[1],
        year: date[2]
    }

    let ack = await fetch('/delete', {
        method: 'post',
        headers: {
            "content-type":'application/json'
        },
        body : JSON.stringify(body)
    }).then((res)=> res.json())

    console.log(ack)
    displaySummarySection()
    requestAnalytics()
}

/**
 * it changes the options options of the category for input/expense (based on the radio button clicked)
 * clears the category input box
 */
function changeOnRadioClick() {
    if (radioIncome.checked) {
        optionsFill(incomeCategories)
    } else if(radioExpense.checked) {
        optionsFill(expenseCategories)
    }
    categoryInput.value =''
}

/**
 * clears the inputs in the entry section
 */
function clearInputs() {
    addButton.value = 'add entry'
    categoryInput.value = ''
    amountInput.value = ''
    dateInput.value = ''
    radioIncome.checked = true
    changeOnRadioClick()
}

/**
 * things to do when an entry is updated or added
 */
async function processEntry() {
    if(!validateFields(categoryInput.value,amountInput.value,dateInput.value)) {
        alert('fill all fields')
        return
    }

    let entryType = radioExpense.checked ? radioExpense.value : radioIncome.value

    if(!validateCategory(entryType,categoryInput.value)) {
        alert('choose category from given options')
        return
    }

    if(!validateEntryDate(dateInput.value)) {
        alert('choose a date today or before')
        return
    }

    if(!validateAmount(amountInput.value)) {
        alert('enter positive input')
        return
    }

    let reqBody = {}
    reqBody.amount = parseInt(amountInput.value)
    reqBody.category = categoryInput.value
    reqBody.date = dateInput.value
    reqBody.entryType = entryType
    
    if (this.value === 'update') {
        console.log('updating')
        reqBody.id = idForEdit
        reqBody.prevDate = dateForEdit
        console.log(reqBody)
        let ack = await fetch('/update',{
            method: 'post',
            headers: {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(reqBody)
        }).then((res)=> res.json())

        clearInputs()
        idForEdit = ''
        dateForEdit = ''
        addButton.value = 'add entry'
        cancelButton.classList.add('none')
        
        console.log(ack)
        displaySummarySection()
        requestAnalytics()
        return
    }

    let uid = await fetch('/add-entry', {
        method: 'post',
        headers: {
            "content-type":'application/json'
        },
        body : JSON.stringify(reqBody)
    }).then((res)=> res.json())

    clearInputs()
    displaySummarySection()
    requestAnalytics()
}

/**
 * move one month before when the left arrow above table is clicked
 */
function leftArrow() {
    let [year,month]= yearMonthSplit(monthsInRecord.value)
    if (year === 2020 && month === 1) {
        return
    }

    if(month === 1) {
        year -= 1
        month = 12
    } else {
        month -= 1
    }

    monthsInRecord.value = `${year}-${month.toString().padStart(2,'0')}`
    displaySummarySection()
}

/**
 * move one month after when the right arrow above table is clicked
 */
function rightArrow() {
    let [year,month]= yearMonthSplit(monthsInRecord.value)
    let date = new Date()
    if (year === parseInt(date.getFullYear()) && month === parseInt(date.getMonth()+1)) {
        return
    }

    if(month === 12) {
        year += 1
        month = 1
    } else {
        month += 1
    }

    monthsInRecord.value = `${year}-${month.toString().padStart(2,'0')}`
    displaySummarySection()
}

/**
 * to instantly handle from and two month inputs
 */
function processAnalyticMonth() {
    let date = new Date()
    
    let currentMonth = `${date.getFullYear()}-${date.getMonth()+1}`
    if(this.value > currentMonth) {
        this.value = currentMonth
    } else if(this.value < '2020-01') {
        this.value = '2020-01'
    }
    return 
}

/**
 * to request and display the date for the analytics portion
 */
async function requestAnalytics() {
    let fromMonth = fromInput.value
    let toMonth = toInput.value
    if (fromMonth > toMonth) {
        alert('give appropriate from and to months')
        return
    } 
    
    let reqBody = {}

    reqBody.fromMonth = fromMonth
    reqBody.toMonth = toMonth

    let monthsData = await fetch('/analysis', {
        method: 'post',
        headers: {
            "content-type":'application/json'
        },
        body : JSON.stringify(reqBody)
    }).then((res)=> res.json())

    displayAnalytics(monthsData)
    
}

/**
 * things to do when the cancel button is clicked
 */
function cancelEntry() { 
    clearInputs()
    cancelButton.classList.add('none')
    addButton.value = 'Add Entry'
}
