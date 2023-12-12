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

export function validateFields(category,amount,date) {
    if(category && amount && date) {
        return true
    }
    return false
}

export function validateEntryDate(date) {
    let entryDate = new Date(date)
    let today = new Date()

    if(entryDate > today || entryDate.getFullYear() < 2020) {
        return false
    }
    return true
}