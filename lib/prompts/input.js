const util = require('util')
const Base = require('./base')

function Input(ui, config) {
  Base.call(this, ui, config)
}

util.inherits(Input, Base)

const chalk = require('chalk')
/**
 * Override renderError method.
 *
 * Render question like this:
 *   ! error
 */
Input.prototype.printError = function (message) {
  this.ui.write(`${chalk.red('!')} ${message}`)
}

module.exports = Input
