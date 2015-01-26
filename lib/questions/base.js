var _ = require('../utils')
var co = require('co')
var chalk = require('chalk')

/**
 * Question basic constructor.
 *
 * @param {Object} config Configure of the question.
 */
function Base(config) {
  _.extend(this, config)
}

/**
 * Render question output message.
 * Different type question will cover this method to get different output style.
 */
Base.prototype.render = function (prompt){
  prompt.interface.setPrompt(this.message + '\n')
  prompt.interface.prompt()
}

/**
 * Validate answers
 *
 * @param {Boolean|String} answers
 * @returns {Boolean|String|Promise} True or error message, or Promise when `config.validate` is a generator.
 *
 */
var validateNoop = function () {
  return true
}
Base.prototype._validate = function (answer) {
  var base = this
  base.validate = base.validate || validateNoop
  
  // Adapt to normal function and generator.
  var validate
  if (_.isGeneratorFunction(base.validate)) {
    validate = co.wrap(base.validate)
  } else {
    validate = co.wrap(function* (answer) {
      return yield Promise.resolve(base.validate(answer))
    })
  }
  
  return validate(answer)
}

/**
 * To print render message to output and take real `_run` method.
 *
 * @param {Object} prompt Prompt instance to provide interface.
 * @returns {Object} Promise
 */
Base.prototype.run = function (prompt) {
  var base = this
  this.render(prompt)
  
  function make() {
    return co(function* () {
      var answer = yield base._run(prompt)
      var result = yield base._validate(answer)
      
      if (result === true) {
        return answer
      } else {
        prompt.interface.setPrompt(chalk.red('! ') + result + ': ')
        prompt.interface.prompt()
        return yield make()
      }
    })
  }
  
  return make()
}

/**
 * Run question, override in different question.
 *
 * @param {Object} prompt
 * @returns {Object} Promise
 */
Base.prototype._run = function (prompt) {
  var base = this
  return new Promise(function (resolve) {
    prompt.on('line', function (value){
      prompt.answers[base.name] = value
      prompt.interface.pause()
      prompt.off('line')
      resolve(value)
    })
  })
}

module.exports = Base
