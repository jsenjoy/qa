var util = require('util')
var Base = require('./base')

function Input(prompt, config) {
  Base.call(this, prompt, config)
}

util.inherits(Input, Base)

var chalk = require('chalk')
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
  this.prompt.write(chalk.red('! ') + message)
}

module.exports = Input
