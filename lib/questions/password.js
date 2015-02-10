var util = require('util')
var Base = require('./base')

function Password(prompt, config) {
  Base.call(this, prompt, config)
}
util.inherits(Password, Base)

/**
 * Bind keypress event, and mask what you enter.
 */
Password.prototype._run = function () {
  var prompt = this.prompt
  
  return new Promise(function (resolve) {
    var seq = ''
    prompt.on('keypress', function (value, key) {
      if (key && key.name === 'return') {
        resolve(seq)
      } else {
        seq += value
        prompt.left(1)
          .write('*')
      }
    })
  })
}

var chalk = require('chalk')
/**
 * Print *** for answer tip.
 */
Password.prototype.renderAnswer = function (answer) {
  this.prompt.write(chalk.cyan(new Array(answer.length + 1).join('*')) + '\n')
}

module.exports = Password
