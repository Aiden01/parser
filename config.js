const P = require('parsimmon')

/**
   Configuration file parsing, the syntax is:
   prop1 = val1
   prop2 = val2
   ...
**/

const propertyParser = P.regexp(/[a-zA-Z_][a-zA-Z0-9_]*/i)

const valueNumberParser = P.regexp(/[0-9]*/i).map(Number)
const valueStringParser = P.regexp(/"((?:\\.|.)*?)"/, 1)

const valueParser = P.alt(valueStringParser, valueNumberParser)
const configParser = P.seq(propertyParser, P.string('='), valueParser).map(
    ([key, , value]) => ({ [key]: value })
)

const parseConfig = contents =>
    flatten(
        contents
            .split(';')
            .map(c => configParser.parse(c))
            .map(parsed => parsed.value)
    )

const flatten = arr => arr.reduce((acc, curr) => ({ ...acc, ...curr }), {})
console.log(parseConfig('key1="value1";key2="value2"'))
