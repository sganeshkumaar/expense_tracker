export const expenseCategories = ["Food","Rent","Petrol","Gadgets","Groceries","others"]
export const incomeCategories = ["Salary","Free Lancing","interest","Rental","Profits","others"]

/**
 * @param {Number} amount 
 * @returns {Boolean} if the given amount is positive or not
 */
export function validateAmount(amount) {
    if(amount <= 0) {
        return false
    }
    return true
}

/**
 * to validate that the given month is within the intended period
 * @param {number} year given year input
 * @param {number} month given month input
 * @returns {boolean}
 */
export function yearMonthValidate(year, month) {
    let date = new Date()

    if(year < 2020 || year > date.getFullYear()) {
        return false
    } 
    
    if(year === date.getFullYear() && month > date.getMonth()+1) {
        return false
    }

    return true
}

/**
 * to validate the input category is in a pre-listed set of categories
 * @param {String} entryType type of entry
 * @param {String} category  category of entry
 * @returns {Boolean}
 */
export function validateCategory(entryType, category) {
    if(entryType === 'ex') {
        if(expenseCategories.includes(category)) {
            return true
        }
    } else if(entryType === 'in'){
        if(incomeCategories.includes(category)) {
            return true
        }
    }
    return false
}

/**
 * to validate all the fields are fill with data
 * @param {String} category category of entry
 * @param {number} amount entered amount
 * @param {String} date date of entry 
 * @returns {Boolean}
 */
export function validateFields(category,amount,date) {
    if(category && amount && date) {
        return true
    }
    return false
}

/**
 * to validate the entry date is in the intended time period
 * @param {String} date date of entry 
 * @returns 
 */
export function validateEntryDate(date) {
    let entryDate = new Date(date)
    let today = new Date()

    if(entryDate > today || entryDate.getFullYear() < 2020) {
        return false
    }
    return true
}