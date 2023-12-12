import * as validationFunctions from '../../js/validate.js'

test("Validate the given amount is a positive value", () => {
    expect(validationFunctions.validateAmount(-20)).toBe(false)
    expect(validationFunctions.validateAmount(0)).toBe(false)
    expect(validationFunctions.validateAmount(200)).toBe(true)
})

test("validate that the given month is between 2020-1 and current month including both of the end months", () => {
    expect(validationFunctions.yearMonthValidate(2010,12)).toBe(false)
    expect(validationFunctions.yearMonthValidate(2020,1)).toBe(true)
    expect(validationFunctions.yearMonthValidate(2023,12)).toBe(true)
    expect(validationFunctions.yearMonthValidate(2024,1)).toBe(false)
})

test("validate the given category is present in the predefined list",() => {
    expect(validationFunctions.validateCategory('ex','Rent')).toBe(true)
    expect(validationFunctions.validateCategory('ex','others')).toBe(true)
    expect(validationFunctions.validateCategory('ex','Food')).toBe(true)

    expect(validationFunctions.validateCategory('in','Salary')).toBe(true)
    expect(validationFunctions.validateCategory('in','Free Lancing')).toBe(true)
    expect(validationFunctions.validateCategory('in','Rental')).toBe(true)

    expect(validationFunctions.validateCategory('in','23jhv2323')).toBe(false)
    expect(validationFunctions.validateCategory('ex','--2823')).toBe(false)
})

test('validate if all the inputs are filled', () => {
    expect(validationFunctions.validateFields(null,'23','2023-02-23')).toBe(false)
    expect(validationFunctions.validateFields('Food',null,'2023-02-23')).toBe(false)
    expect(validationFunctions.validateFields('Food','23',null)).toBe(false)
    expect(validationFunctions.validateFields('FOod','23','2023-02-23')).toBe(true)
});

test('validate that the given input is today or before', () => {
    let date= new Date()
    expect(validationFunctions.validateEntryDate('2019-12-31')).toBe(false)
    expect(validationFunctions.validateEntryDate('2020-01-01')).toBe(true)
    expect(validationFunctions.validateEntryDate('2021-12-31')).toBe(true)
    expect(validationFunctions.validateEntryDate(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)).toBe(true)
    expect(validationFunctions.validateEntryDate(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`)).toBe(false)
    expect(validationFunctions.validateEntryDate('2100-12-31')).toBe(false)
});



