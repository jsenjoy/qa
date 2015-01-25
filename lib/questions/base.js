var _ = require('lodash')

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
 * @returns {Boolean} Pass or not.
 */
 Base.prototype.validate = function (prompt) {
   
 }

/**
 * To print render message to output and create promise
 *
 * @param {Object} prompt Prompt instance to provide interface.
 * @returns {Object} Promise
 */
Base.prototype.run = function (prompt) {
  var base = this
  this.render(prompt)
  return new Promise(function (resolve) {
    prompt.on('line', function (value){
      prompt.answers[base.name] = value
      resolve(value)
      prompt.interface.pause()
      prompt.off('line')
    })
  })
}

module.exports = Base
