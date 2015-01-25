var util = require('util')
var chalk = require('chalk')
var Base = require('./base')

function Input(config) {
  Base.call(this, config)
}

util.inherits(Input, Base)

Input.prototype.render = function (prompt) {
  prompt.interface.setPrompt(chalk.green('? ') + this.message + ': ')
  prompt.interface.prompt()
}

module.exports = Input
