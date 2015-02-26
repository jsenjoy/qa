const util = require('util')
const Base = require('./base')

function Password(ui, config) {
  Base.call(this, ui, config)
}
util.inherits(Password, Base)

/**
 * Bind keypress event, and mask what you enter.
 */
Password.prototype.wait = function () {
  var ui = this.ui
  
  return new Promise(function (resolve) {
    var seq = ''
    ui.on('keypress', function (value, key) {
      if (key && key.name === 'return') {
        resolve(seq)
      } else {
        seq += value
        ui
          .left(1)
          .write('*')
      }
    })
  })
}

const chalk = require('chalk')
/**
 * Print *** for answer tip.
 */
Password.prototype.printAnswer = function () {
  this.ui.write(chalk.cyan(new Array(this.answer.length + 1).join('*')) + '\n')
}

module.exports = Password
