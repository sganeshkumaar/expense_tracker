import * as validationFunctions from '../../js/validate.js'

test("Validate the given amount is a positive value", () => {
    expect(validationFunctions.validateAmount(-20)).toBe(false)
    expect(validationFunctions.validateAmount(0)).toBe(false)
    expect(validationFunctions.validateAmount(200)).toBe(true)
})

test("Validate the given amount is a positive value", () => {
    expect(validationFunctions.yearValidate()).toBe(false)
    expect(validationFunctions.yearValidate()).toBe(false)
    expect(validationFunctions.yearValidate()).toBe(true)
})
