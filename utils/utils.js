const { isInt, isDate, isDateTime, isTime, isLocalDateTime, isLocalTime, isDuration } = require('neo4j-driver');


function toNativeTypes(properties) {
  return Object.fromEntries(Object.keys(properties).map((key) => {
    let value = valueToNativeType(properties[key])
    return [ key, value ]
  }))
}


function valueToNativeType(value) {
  if ( Array.isArray(value) ) {
    value = value.map(innerValue => valueToNativeType(innerValue))
  }
  else if ( isInt(value) ) {
    value = value.toNumber()
  }
  else if (
    isDate(value) ||
    isDateTime(value) ||
    isTime(value) ||
    isLocalDateTime(value) ||
    isLocalTime(value) ||
    isDuration(value)
  ) {
    value = value.toString()
  }
  else if (typeof value === 'object' && value !== undefined  && value !== null) {
    value = toNativeTypes(value)
  }

  return value
}

module.exports = { toNativeTypes };