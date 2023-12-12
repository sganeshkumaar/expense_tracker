import * as unitFunction from '../../js/unit.js'

test('to take integer values of year and month from the year month string', () => {
    expect(unitFunction.yearMonthSplit('2023-12')).toEqual([2023,12])
    expect(unitFunction.yearMonthSplit('1000-11')).toEqual([1000,11])
    expect(unitFunction.yearMonthSplit('2022-02')).toEqual([2022,2])
});

test('to calculate the percentage for a given total and a particular amount', () => {
    expect(unitFunction.calculatePercentage(1221,0)).toBe(0)
    expect(unitFunction.calculatePercentage(1000,1000)).toBe(100)
    expect(unitFunction.calculatePercentage(100,1000)).toBe(10)
    expect(unitFunction.calculatePercentage(101,1000)).toBe(10)
});

