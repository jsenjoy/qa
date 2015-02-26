const _ = require('lodash')
const co = require('co')

function* generator() {
  yield null
}

_.isGeneratorFunction = function isGeneratorFunction (obj) {
  return obj && obj.constructor == generator.constructor
}

_.isPromise = function isPromise (obj) {
  return typeof obj.then == 'function'
}

/**
 * Using `co` to wrap, adapt to normal function and generator.
 *
 * @param {Function} fn
 * @returns {Function} Run `fn` and return promise.
 */
_.colize = function colize (fn) {
  if (_.isGeneratorFunction(fn)) {
    return co.wrap(fn)
  } else {
    return co.wrap(function* () {
      return yield Promise.resolve(fn.apply(this, arguments))
    })
  }
}

module.exports = _
