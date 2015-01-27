var util = require('util')
var chalk = require('chalk')
var Base = require('./base')

function Input(prompt, config) {
  Base.call(this, prompt, config)
}

util.inherits(Input, Base)

Input.prototype.render = function () {
  var inter = this.prompt.interface
  inter.setPrompt(chalk.green('? ') + this.message + ': ')
  inter.prompt()
}

module.exports = Input
