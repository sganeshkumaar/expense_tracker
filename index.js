const monthEleInRecord = document.querySelector('#records-portion #month-input')
const table = document.querySelector('.records-table')
const datalist = document.querySelector('#categories')
const addButton = document.querySelector('#add-entry-button input')

const expenseCategories = ["Food","Rent","Petrol","Gadgets","Groceries","others"]
const incomeCategories = ["Salary","Free Lancing","interest","Rental","Profits","others"]

const cancelButton = document.querySelector('#cancel-button')

let idForEdit = ''
let dateForEdit = ''

let categoryInput,amountInput,dateInput

const summaryIncome = document.querySelector('.income-value')
const summaryExpense = document.querySelector('.expense-value')
const summaryTally = document.querySelector('.tally-value')
const summaryBalance = document.querySelector('.balance-value')

displaySummarySection()
optionsFill(incomeCategories)

monthEleInRecord.addEventListener('change',displaySummarySection)

document.querySelector('#left-arrow').addEventListener('click',leftArrow)
document.querySelector('#right-arrow').addEventListener('click',rightArrow)

async function displaySummarySection (){

    let [year,month] = yearMonthSplit(monthEleInRecord.value)
    if(!(yearValidate(year))) {
        let date = new Date()
        monthEleInRecord.value = `${date.getFullYear()}-${date.getMonth()}`
        return
    }

    month = month.toString().padStart(2,'0')
    
    let monthSummary = await fetch(`/get-month?year=${year}&month=${month}`).then((res)=> res.json())

    displayTable(monthSummary.monthData)
    displaySummary(monthSummary)
}

function displaySummary(monthSummary) {
    
    let monthEx 
    if(monthSummary.monthData && monthSummary.monthData.ex){
            monthEx = monthSummary.monthData.ex
    } else {
        monthEx = 0
    }

    let monthIn 
    if(monthSummary.monthData && monthSummary.monthData.in) {
        monthIn = monthSummary.monthData.in
    } else {
        monthIn = 0
    }

    let balance = monthSummary.in - monthSummary.ex
    
    summaryIncome.innerText = monthIn
    summaryExpense.innerText = monthEx
    summaryTally.innerText = monthIn - monthEx

    if((monthIn-monthEx) < 0) {
        summaryTally.style.color = 'red'
    } else if((monthIn-monthEx) > 0) {
        summaryTally.style.color = 'green'
    } else {
        summaryTally.style.color = 'black'
    }

    if(balance < 0) {
        summaryBalance.style.color = 'red'
    } else if(balance > 0) {
        summaryBalance.style.color = 'green'
    } else {
        summaryBalance.style.color = 'black'
    }

    summaryBalance.innerText = balance
}

function displayTable(monthData) {
    table.innerHTML = `<tr>
    <th>Date</th>
    <th>Category</th>
    <th>Amount</th>
    </tr>`
    if(!(monthData)) {
        return
    }
    let ids = Object.keys(monthData).filter((id) => {
        return (id != "ex" && id != "in")
    })
    ids = ids.sort((a,b) => {

        if(monthData[a].date === monthData[b].date) {
            console.log('same date')
            if(monthData[a].entryType === monthData[b].entryType) {
                if(monthData[a].amount < monthData[b].amount) {
                    return -1
                } else {
                    return 1
                }
            } else {
                if(monthData[a].entryType === "in" && monthData[b].entryType === "ex") {
                    return -1
                } else {
                    return 1
                }
            }
        }
        let date1 = new Date(monthData[a].date)
        let date2 = new Date(monthData[b].date)

        if(date1 > date2) {
            return 1
        } else if(date1 < date2) {
            return -1
        }
        return 0
    })

    for (let id of ids) {

        let date = monthData[id].date.split('-')
        table.innerHTML+= `<tr id='${id}' class='${monthData[id].entryType}'>
        <td >
          <div class="date-options">
              <img src="./assets/edit.png" alt=""  class="edit">
              <img src="./assets/delete.svg" alt="" class="delete">
              <div class="date">${date[2]}-${date[1]}-${date[0]}</div>
          </div>
        </td>
        <td>${monthData[id].category}</td>
        <td>RS ${monthData[id].amount}</td>
      </tr>`
    }
    editButtonListeners()
    deleteButtonListeners()
}

function editButtonListeners() {
    let editButtons = document.querySelectorAll('.edit')
    editButtons.forEach((button) => {
        button.addEventListener('click',editClick)
    });
}

async function editClick() {
    idForEdit = this.parentNode.parentNode.parentNode.id
    dateForEdit = this.nextElementSibling.nextElementSibling.innerHTML
    
    let [date,month,year] = dateForEdit.split('-')
    dateInput.value = `${year}-${month}-${date}`
    dateForEdit = dateInput.value

    categoryInput.value = this.parentNode.parentNode.nextElementSibling.innerText

    amountInput.value = this.parentNode.parentNode.nextElementSibling.nextElementSibling.innerText.split(' ')[1]

    if(this.parentNode.parentNode.parentNode.classList.contains('ex')) {
        radioExpense.checked = true
    } else {
        radioIncome.checked = true
    }

    cancelButton.style.display = 'block'
    addButton.value = 'update'
}

async  function deleteButtonListeners() {
    let deleteButtons = document.querySelectorAll('.delete')
    deleteButtons.forEach((button) => {
        button.addEventListener('click',deleteClick)
    });
}

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
}

const radioIncome = document.querySelector('#income-option')
const radioExpense = document.querySelector('#expense-option')


radioIncome.addEventListener('click',changeOnRadioClick)
radioExpense.addEventListener('click',changeOnRadioClick)

function changeOnRadioClick() {
    if (radioIncome.checked) {
        optionsFill(incomeCategories)
    } else if(radioExpense.checked) {
        optionsFill(expenseCategories)
    }
    categoryInput.value =''
}

function optionsFill(options) {
    datalist.innerHTML = ''
    for (let category of options) {
        datalist.innerHTML += `<option value="${category}"></option>`
    }
}

addButton.addEventListener('click',processEntry)

categoryInput =document.querySelector('#category-input')
amountInput =document.querySelector('#amount-input')
dateInput =document.querySelector('#date-input')

function clearInputs() {
    addButton.value = 'add entry'
    categoryInput.value = ''
    amountInput.value = ''
    dateInput.value = ''
    radioIncome.checked = true
    changeOnRadioClick()
}

async function processEntry() {
    if(!(categoryInput.value && amountInput.value && dateInput.value)) {
        alert('fill all fields')
        return
    }
    let entryType = radioExpense.checked ? radioExpense.value : radioIncome.value

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
        cancelButton.style.display = 'none'
        
        console.log(ack)
        displaySummarySection()
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
}

function leftArrow() {
    let [year,month]= yearMonthSplit(monthEleInRecord.value)
    if (year === 2023 && month === 1) {
        return
    }

    if(month === 1) {
        year -= 1
        month = 12
    } else {
        month -= 1
    }

    monthEleInRecord.value = `${year}-${month.toString().padStart(2,'0')}`
    displaySummarySection()
}

function rightArrow() {
    let [year,month]= yearMonthSplit(monthEleInRecord.value)
    if (year === 2030 && month === 12) {
        return
    }

    if(month === 12) {
        year += 1
        month = 1
    } else {
        month += 1
    }

    monthEleInRecord.value = `${year}-${month.toString().padStart(2,'0')}`
    displaySummarySection()
}

function yearValidate(year) {
    if(year < 2023 || year > 2030) {
        return false
    }
    return true
}

function yearMonthSplit(yearMonthText) {
    let [year,month]= yearMonthText.split('-')
    year = parseInt(year)
    month = parseInt(month)
    return [year,month]
}

