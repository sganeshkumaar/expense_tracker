const monthEleInRecord = document.querySelector('#records-portion #month-input')
const table = document.querySelector('.records-table')
const datalist = document.querySelector('#categories')
const addEntry = document.querySelector('#add-entry-button input')

const expenseCategories = ["Food","Rent","Petrol","Gadgets","Groceries","others"]
const incomeCategories = ["Salary","Free Lancing","interest","Rental","Profits","others"]

let categoryInput,amountInput,dateInput


summaryInputChange()
optionsFill(incomeCategories)

monthEleInRecord.addEventListener('change',summaryInputChange)

document.querySelector('#left-arrow').addEventListener('click',leftArrow)
document.querySelector('#right-arrow').addEventListener('click',rightArrow)

async function summaryInputChange (){
    let [year,month] = yearMonthSplit(monthEleInRecord.value)
    if(!(yearValidate(year))) {
        let date = new Date()
        monthEleInRecord.value = `${date.getFullYear()}-${date.getMonth()}`
        return
    }
    
    let monthData = await fetch(`/get-month?year=${year}&month=${month}`).then((res)=> res.json())
    displayTable(monthData)
}

function displayTable(monthData) {
    table.innerHTML = `<tr>
    <th>Date</th>
    <th>Category</th>
    <th>Amount</th>
    </tr>`
    for (let id in monthData) {
        table.innerHTML+= `<tr id='${id}' class='${monthData[id]["entry-type"]}'>
        <td >
          <div class="date-options">
              <img src="./assets/edit.png" alt=""  class="edit">
              <img src="./assets/delete.svg" alt="" class="delete">
              <div class="date">${monthData[id].date}</div>
          </div>
        </td>
        <td>${monthData[id].category}</td>
        <td>RS ${monthData[id].amount}</td>
      </tr>`
    }
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
    summaryInputChange()
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
    summaryInputChange()
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
}

function optionsFill(options) {
    datalist.innerHTML = ''
    for (let category of options) {
        datalist.innerHTML += `<option value="${category}"></option>`
    }
}

addEntry.addEventListener('click',processEntry)

categoryInput =document.querySelector('#category-input')
amountInput =document.querySelector('#amount-input')
dateInput =document.querySelector('#date-input')

function processEntry() {
    if(!(categoryInput.value && amountInput.value && dateInput.value)) {
        alert('fill all fields')
        return
    }
    let entryType = radioExpense.checked ? radioExpense.value : radioIncome.value
    alert(entryType)

    let amount = amountInput.value
    let category = categoryInput.value
    let date = dateInput.value
}