var util = require('util')
var Base = require('./base')

function List(prompt, config) {
  Base.call(this, prompt, config)
}
util.inherits(List, Base)

var chalk = require('chalk')
List.prototype.render = function () {
  var str = chalk.green('? ') + this.message + ': \n'
  
  this.prompt
    .cacheCursorPos()
    .write(str)
      
  this.renderList()
}

var figures = require('figures')
var pointer = figures.pointer
List.prototype._run = function () {
  var prompt = this.prompt
  var choises = this.choises
  var count = choises.length - 1
  var cur = 0
  
  prompt.hideCursor()
  
  return new Promise(function (resolve) {
    prompt.on('keypress', function (value, key) {
      if (key && key.name === 'return') {
        prompt.showCursor()
        resolve(choises[cur])
      }
      
      if (key && key.name === 'up') {
        if (cur > 0) {
          cur--
          prompt
            .head()
            .write('  ')
            .up()
            .head()
            .write(' ' + chalk.blue(pointer))
        }
      }
      
      if (key && key.name === 'down') {
        if (cur < count) {
          cur++
          prompt
            .head()
            .write('   ')
            .down()
            .head()
            .write(' ' + chalk.blue(pointer))
        }
      }
    })
  })
}

List.prototype.renderList = function () {
  var prompt = this.prompt
  var choises = this.choises
  var len = choises.length
  var defIndex = choises.indexOf(this.default)
  this.choises.forEach(function (choise, index) {
    var str = ' '
    if ((defIndex === -1 && index === 0) || index === defIndex) {
      str += chalk.blue(pointer + ' ') + choise + (index === len - 1 ? '' : '\n')
    } else {
      str += '  ' + choise + (index === len - 1 ? '' : '\n')
    }
    
    prompt.write(str)
  })
  prompt.up(len - 1)
  prompt.left(choises[len - 1].length + 3)
}

List.prototype.doAfter = function () {
  
}

module.exports = List
