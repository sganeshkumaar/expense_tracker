const monthEleInRecord = document.querySelector('#records-portion #month-input')
const table = document.querySelector('.records-table')

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
    for ( let id in monthData) {
        table.innerHTML+= `<tr>
        <td id='${id}' class>
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
