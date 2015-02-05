var util = require('util')
var chalk = require('chalk')
var Base = require('./base')

function Input(prompt, config) {
  Base.call(this, prompt, config)
}

util.inherits(Input, Base)

/**
 * Override render method.
 *
 * Render question like this:
 *   ? question: (default)
 */
Input.prototype.render = function () {
  var rl = this.prompt.rl
  var str = chalk.green('? ') + this.message + ': '
  
  if (this.default) {
    str += '(' + this.default + ')'
  }
  
  rl.setPrompt(str)
  this.prompt.cacheCursorPos()
  rl.prompt()
}

/**
 * Override renderError method.
 *
 * Render question like this:
 *   ! error
 */
Input.prototype.renderError = function (message) {
  var prompt = this.prompt
  prompt.write(chalk.red('! ') + message)
}

module.exports = Input
