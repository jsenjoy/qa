const _ = require('../utils')
const co = require('co')
const chalk = require('chalk')
const noop = _.noop

/**
 * Prompt basic constructor.
 *
 * @param {Object} config Configure of the prompt.
 */
function Base(ui, config) {
  this.config = config
  this.ui = ui
}

/**
 * Render question output message.
 * Different type question will cover this method to get different output style.
 */
Base.prototype.render = function () {
  var ui = this.ui
  var rl = ui.rl
  const config = this.config
  var str = `${chalk.green('?')} ${config.message}: `
  
  if (this.default) {
    str += `(${config.default})`
  }
  
  rl.setPrompt(str)
  this.ui.cacheCursorPos()
  rl.prompt()
}

/**
 * Move cursor and clean last answer when validate error.
 *
 * @returns {Object} Self.
 */
Base.prototype.error = function (result) {
  this.printError(result, this.answer)
  
  this.ui
    .restoreCursorPos()
    .up(1)
    .cleanAfter()
    .cacheCursorPos()
}

/**
 * Render error when validation fails (will be overridden)
 */
Base.prototype.printError = noop

/**
 * Filter answer, also make the process.
 *
 * @param {boolean|string|number} answer
 * @returns Self.
 */
var filterNoop = function (answer) {
  return answer
}
Base.prototype.filter = function (answer) {
  var filter = _.colize(this.config.filter || filterNoop)
  return filter(answer)
}

/**
 * Validate answers
 *
 * @param {boolean|string|number} answer
 * @returns {boolean|string|number|Promise} True or error message, or Promise when `config.validate` is a generator.
 */
var validateNoop = function () {
  return true
}
Base.prototype.validate = function () {
  var validate = _.colize(this.config.validate || validateNoop)
  return validate(this.answer)
}

/**
 * Print answer.
 *
 * @param {boolean|string|number} answer
 */
Base.prototype.printAnswer = function (answer) {
  this.ui.write(chalk.cyan(`${answer}\n`))
}

/**
* Do something after taking the answer, like clean input, print answer and so on.
*/
Base.prototype.finish = function () {
  var len = this.default ? this.default.length : -2
  
  this.ui
    .restoreCursorPos()
    .up(1)
    .left(len + 2)
    .cleanAfter()
    
  this.printAnswer(this.answer)
}

/**
 * To print render message to output and take real `_run` method.
 *
 * @returns {Object} Promise
 */
Base.prototype.run = function () {
  var base = this
  var ui = this.ui
  this.render()
  
  function make() {
    return co(function* () {
      var answer = base.answer = yield base.wait()
      // Use default value.
      if (base.config.default && answer === '') {
        answer = base.answer = base.config.default
      }
      var result = yield base.validate()
      
      if (result === true) {
        // ui.answers[base.name] = answer
        ui.clean()
        ui.rl.pause()
        base.answer = yield base.filter(answer)
        base.finish()
        return base.answer
      } else {
        base.error(result)
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
Base.prototype.wait = function () {
  var ui = this.ui
  return new Promise(function (resolve) {
    ui.on('line', function (value){
      ui.off('line')
      resolve(value)
    })
  })
}

module.exports = Base
