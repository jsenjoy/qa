var util = require('util')
var Base = require('./base')

function Confirm (prompt, config) {
  Base.call(this, prompt, config)
  this.default = this.default === undefined ? true : this.default
  
  // Noop
  this.validate = function () { return true }
  
  var confirm = this
  this.filter = function (answer) {
    if (confirm.default) {
      return answer.toUpperCase() === 'N' ? false : true
    } else {
      return answer.toUpperCase() === 'Y' ? true : false
    }
  }
}
util.inherits(Confirm, Base)

var chalk = require('chalk')
/**
 * Confirm type render.
 */
Confirm.prototype.render = function () {
  var rl = this.prompt.rl
  var str = chalk.green('? ') + this.message + ': '
  
  str += this.default ? '(Y/n)' : '(y/N)'
  
  rl.setPrompt(str)
  this.prompt.cacheCursorPos()
  rl.prompt()
}

module.exports = Confirm
