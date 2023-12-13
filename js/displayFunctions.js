const table = document.querySelector('.records-table')
const summaryIncome = document.querySelector('.income-value')
const summaryExpense = document.querySelector('.expense-value')
const summaryTally = document.querySelector('.tally-value')
const summaryBalance = document.querySelector('.balance-value')
const incomeSection = document.querySelector('.income-section')
const expenseSection = document.querySelector('.expense-section')
const datalist = document.querySelector('#categories')
const generalMetricSection = document.querySelector('.general-metric')

import {editButtonListeners,deleteButtonListeners} from './index.js'
import {expenseCategories,incomeCategories} from './validate.js'
import { calculatePercentage } from './unit.js'

/**
 * Fill the monthly summary portion
 * @param {Object} monthSummary month data entries as an object as well as total income and expense
 */
export function displaySummary(monthSummary) {
    
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
    
    summaryIncome.innerText = monthIn.toLocaleString("en-IN")
    summaryExpense.innerText = monthEx.toLocaleString("en-IN")
    summaryTally.innerText = (monthIn - monthEx).toLocaleString("en-IN")

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

    summaryBalance.innerText = balance.toLocaleString("en-IN")
}

/**
 * 
 * @param {String} a id of first entry 
 * @param {String} b if of second entry 
 * @param {Object} monthData object containing all the entries of the month 
 * @returns {number} whether to be sorted before or after 
 */
function entriesSorting(a,b,monthData) {
    if(monthData[a].date === monthData[b].date) {
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
}

/**
 * Fill the entries table
 * @param {Object} monthData month data entries as an object
 */
export function displayTable(monthData) {
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
        return entriesSorting(a,b,monthData)
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
        <td>Rs. ${monthData[id].amount.toLocaleString("en-IN")}</td>
      </tr>`
    }
    editButtonListeners()
    deleteButtonListeners()
}

/**
 * fills the options in the category input box
 * @param {array} options categories to be filled as options
 */
export function optionsFill(options) {
    datalist.innerHTML = ''
    for (let category of options) {
        datalist.innerHTML += `<option value="${category}"></option>`
    }
}

/**
 * fill the analysis portion
 * @param {array} monthsData array containing objects of all the months given in the from to month input
 */
export function displayAnalytics(monthsData) {
    let monthsArray = monthsData.array.filter((month) => {
        return !( (!(month.in) || month.in ===0) && (!(month.ex) || month.ex ===0))
    })
    
    let expense = 0
    let income = 0
    let expenseCategoryAmount  = { }
    let incomeCategoryAmount = { }

    for (let category of incomeCategories) {
        incomeCategoryAmount[category] = 0
    }

    for (let category of expenseCategories) {
        expenseCategoryAmount[category] = 0
    }

    for(let month of monthsArray) {
        let entryIds = Object.keys(month).filter((id) => {
            return (id != "ex" && id != "in")
        })

        if(month.in) {
            income += month.in
        }

        if(month.ex) {
            expense += month.ex
        }

        for(let id of entryIds) {
            if(month[id].entryType === 'in') {
                incomeCategoryAmount[month[id].category] += month[id].amount
            } else {
                expenseCategoryAmount[month[id].category] += month[id].amount
            }
        }
    }

    generalMetricSection.querySelector('.income-value').innerHTML = `Rs .${income.toLocaleString("en-IN")}`
    generalMetricSection.querySelector('.expense-value').innerHTML = `Rs. ${expense.toLocaleString("en-IN")}`
    generalMetricSection.querySelector('.tally-value').innerHTML = `Rs. ${(income-expense).toLocaleString("en-IN")}`

    if( income-expense < 0) {
        generalMetricSection.querySelector('.tally-value').style.color = `red`
    } else if(income-expense > 0) {
        generalMetricSection.querySelector('.tally-value').style.color = `green`
    }

    for(let category of incomeCategories) {
        incomeSection.querySelector(`.${category.replace(/\s/g, '').toLowerCase()}`).innerHTML = `Rs. ${incomeCategoryAmount[category].toLocaleString("en-IN")}`
        incomeSection.querySelector(`.${category.replace(/\s/g, '').toLowerCase()}-per`).innerHTML = `${calculatePercentage(incomeCategoryAmount[category],income).toLocaleString("en-IN")}`
    }

    for(let category of expenseCategories) {
        expenseSection.querySelector(`.${category.replace(/\s/g, '').toLowerCase()}`).innerHTML = `Rs. ${expenseCategoryAmount[category].toLocaleString("en-IN")}`
        expenseSection.querySelector(`.${category.replace(/\s/g, '').toLowerCase()}-per`).innerHTML = `${calculatePercentage(expenseCategoryAmount[category],expense).toLocaleString("en-IN")}`
    }
}