const util = require('util')
const Base = require('./base')

function Confirm (ui, config) {
  Base.call(this, ui, config)
  this.config.default = config.default === undefined ? true : config.default
  
  // Noop
  this.config.validate = function () { return true }
  
  // Map answer to boolean.
  var confirm = this
  this.config.filter = function (answer) {
    if (confirm.config.default) {
      return answer.toUpperCase() === 'N' ? false : true
    } else {
      return answer.toUpperCase() === 'Y' ? true : false
    }
  }
}
util.inherits(Confirm, Base)

const chalk = require('chalk')
/**
 * Confirm type render.
 */
Confirm.prototype.render = function () {
  var rl = this.ui.rl
  var config = this.config
  var str = `${chalk.green('?')} ${config.message}: ${config.default ? '(Y/n)' : '(y/N)'}`
  
  rl.setPrompt(str)
  this.ui.cacheCursorPos()
  rl.prompt()
}

/**
 * Just to clean using special length.
 */
Confirm.prototype.finish = function () {
  this.ui
    .restoreCursorPos()
    .up(1)
    .left(5)
    .cleanAfter()
  
  this.printAnswer(this.answer)
}

module.exports = Confirm
