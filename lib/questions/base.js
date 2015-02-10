var _ = require('../utils')
var co = require('co')

/**
 * Question basic constructor.
 *
 * @param {Object} config Configure of the question.
 */
function Base(prompt, config) {
  _.extend(this, config)
  this.prompt = prompt
}

/**
 * Render question output message.
 * Different type question will cover this method to get different output style.
 */
Base.prototype.render = function () {}

/**
 * Move cursor and clean last answer when validate error.
 *
 * @returns {Object} Self.
 */
Base.prototype.doError = function (result, answer) {
  this.renderError(result, answer)
  
  var prompt = this.prompt
  prompt.restoreCursorPos()
    .up(1)
    .cleanAfter()
    .cacheCursorPos()
}

/**
 * Render error when validation fails (will be overridden)
 */
Base.prototype.renderError = function () {}

/**
 * Using `co` to wrap, adapt to normal function and generator.
 *
 * @param {Function} fn
 * @returns {Function} Run `fn` and return promise.
 */
function colize (fn) {
  if (_.isGeneratorFunction(fn)) {
    return co.wrap(fn)
  } else {
    return co.wrap(function* () {
      return yield Promise.resolve(fn.apply(this, arguments))
    })
  }
}

/**
 * Filter answer, also make the process.
 *
 * @param {Mixed} answer
 * @returns Self.
 */
var filterNoop = function (answer) {
  return answer
}
Base.prototype._filter = function (answer) {
  var filter = colize(this.filter || filterNoop)
  return filter(answer)
}

/**
 * Validate answers
 *
 * @param {Boolean|String} answer
 * @returns {Boolean|String|Promise} True or error message, or Promise when `config.validate` is a generator.
 */
var validateNoop = function () {
  return true
}
Base.prototype._validate = function (answer) {
  var validate = colize(this.validate || validateNoop)
  return validate(answer)
}

/**
 * Print answer.
 *
 * @param {Boolean|String} answer
 */
var chalk = require('chalk')
Base.prototype.renderAnswer = function (answer) {
  this.prompt.write(chalk.cyan(answer + '\n'))
}

/**
* Do something after taking the answer, like clean input, print answer and so on.
*/
Base.prototype.doAfter = function (answer) {
  var len = this.default ? this.default.length : -2
  
  this.prompt
    .restoreCursorPos()
    .up(1)
    .left(len + 2)
    .cleanAfter()
    
  this.renderAnswer(answer)
}

/**
 * To print render message to output and take real `_run` method.
 *
 * @returns {Object} Promise
 */
Base.prototype.run = function () {
  var base = this
  var prompt = this.prompt
  this.render()
  
  function make() {
    return co(function* () {
      var answer = yield base._run()
      // Use default value.
      if (base.default && answer === '') {
        answer = base.default
      }
      var result = yield base._validate(answer)
      
      if (result === true) {
        prompt.answers[base.name] = answer
        prompt.clean()
        prompt.rl.pause()
        var realAnswer = yield base._filter(answer)
        base.doAfter(realAnswer)
        return realAnswer
      } else {
        base.doError(result, answer)
        return yield make()
      }
    })
  }
    
  return make()
}

/**
 * Run question, override in different question.
 *
 * @returns {Object} Promise
 */
Base.prototype._run = function () {
  var prompt = this.prompt
  return new Promise(function (resolve) {
    prompt.on('line', function (value){
      prompt.off('line')
      resolve(value)
    })
  })
}

module.exports = Base
