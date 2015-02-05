var util = require('util')
var chalk = require('chalk')
var Base = require('./base')

function Input(prompt, config) {
  Base.call(this, prompt, config)
}

util.inherits(Input, Base)

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

Input.prototype.renderError = function (message) {
  var prompt = this.prompt
  prompt.write(chalk.red('! ') + message)
  prompt.restoreCursorPos()
}

module.exports = Input
