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
 * Validate answers
 *
 * @param {Boolean|String} answers
 * @returns {Boolean|String|Promise} True or error message, or Promise when `config.validate` is a generator.
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
        return answer
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
