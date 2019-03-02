const P = require('parsimmon')

/*
  parses the day of the month, for example:
  1st
  2nd
  2rd
*/
const dayOfTheMonthParser = P.regexp(/[0-9]+/)
    .map(Number)
    .chain(num =>
        numberDaySuffixParser.fallback(' ').chain(() => {
            if (num >= 1 && num <= 31) {
                return P.succeed(num)
            }
            return P.fail('The day of the month must be between 1 and 31')
        })
    )

const numberDaySuffixParser = P.alt(
    P.string('st'),
    P.string('nd'),
    P.string('rd'),
    P.string('th')
)

const monthNames = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
}

// Parses a month with its name
const namedMonthParser = P.letters.chain(s => {
    const n = monthNames[s.toLowerCase()]
    if (n) {
        return P.succeed(n)
    } else {
        return P.fail(`${s} is not a valid month`)
    }
})

// Parses a month with its number
const numberMonthParser = P.regexp(/[0-9]+/)
    .map(Number)
    .chain(month => {
        if (month >= 1 && month <= 12) {
            return P.succeed(month)
        }
        return P.fail('Month must be between 1 and 12')
    })

const monthParser = P.alt(namedMonthParser, numberMonthParser)

// Parses 2-4 digits year
const yearParser = P.regexp(/[0-9]+/)
    .map(Number)
    .chain(year => {
        // 4 digits year
        if (year > 999 && year <= 9999) {
            return P.succeed(year)
        }
        // 2 digits year (90s)
        if (year > 30 && year < 99) {
            return P.succeed(1900 + year)
        }
        // 2 digits year (2000s)
        if (year >= 0 && year <= 30) {
            return P.succeed(2000 + year)
        }
        // Invalid year
        return P.fail(`${year} is not a valid year`)
    })

// We accept separator between the numbers
const separatorParser = P.oneOf(',-/ .|').many()

// Parses a full date
const dateParser = P.seq(
    dayOfTheMonthParser,
    separatorParser,
    monthParser,
    separatorParser,
    yearParser
).map(([day, , month, , year]) => {
    return [day, month, year]
})

const parseDate = date =>
    new Promise((resolve, reject) => {
        try {
            const [day, month, year] = dateParser.tryParse(date)
            resolve(`Day: ${day}, month: ${month}, year: ${year}`)
        } catch (e) {
            reject(e.message)
        }
    })

parseDate('2-3-2019')
    .then(console.log)
    .catch(console.error)

exports = {
    parseDate,
}
