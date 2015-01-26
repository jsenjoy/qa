var _ = require('lodash')

function* generator() {
  yield null
}

_.isGeneratorFunction = function (obj) {
  return obj && obj.constructor == generator.constructor
}

_.isPromise = function (obj) {
  return  typeof obj.then == 'function'
}

module.exports = _
