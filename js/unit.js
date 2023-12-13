/**
 * return year and month from the month input string
 * @param {String} yearMonthText "yyyy-mm"
 * @returns {Array} array containing year and month 
 */
export function yearMonthSplit(yearMonthText) {
    let [year,month]= yearMonthText.split('-')
    year = parseInt(year)
    month = parseInt(month)
    return [year,month]
}

/**
 * return amount as a percentage to the total
 * @param {number} amount amount for a particular category  
 * @param {number} total total amount of that particular expense type
 * @returns {number} amount as a percentage to the total
 */
export function calculatePercentage(amount,total) {
    if(total === 0) {
        return 0
    } else {
        return parseInt((amount/total) * 100)
    }
}