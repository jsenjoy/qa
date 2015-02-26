const util = require('util')
const Base = require('./base')

function List(ui, config) {
  Base.call(this, ui, config)
}
util.inherits(List, Base)

const chalk = require('chalk')

/**
 * In order to call `renderList`
 */
List.prototype.render = function () {
  var str = `${chalk.green('?')} ${this.config.message}: \n`
  
  this.ui
    .cacheCursorPos()
    .write(str)
      
  this.renderList()
}

const figures = require('figures')
const pointer = figures.pointer

/**
 * Render choises list
 */
List.prototype.renderList = function () {
  var ui = this.ui
  var choises = this.config.choises
  var len = choises.length
  var defIndex = choises.indexOf(this.config.default)
  
  // Traverse all choises.
  choises.forEach(function (choise, index) {
    var str = ''
    if ((defIndex === -1 && index === 0) || index === defIndex) {
      // default
      str += `${chalk.blue(pointer)} ${choise}${index === len - 1 ? '' : '\n'}`
    } else {
      // normal
      str += `  ${choise}${index === len - 1 ? '' : '\n'}`
    }
    
    ui.write(str)
  })
}

/**
 * Override `wait` method, to change `input` to choose.
 */
List.prototype.wait = function () {
  var ui = this.ui
  var choises = this.config.choises
  var count = choises.length - 1
  var lastLen = choises[count].length
  var cur = 0
  
  // Move cursor and render pointer, type 0 for up, 1 for down.
  function moveRender (type) {
    var method = type ? 'down' : 'up'
    
    ui
      .left(lastLen + 2)
      .up(count - cur)
      .write('  ')
    
    // Each time move to right-bottom.
    ui[method]()
      .left(2)
      .write(chalk.blue(pointer))
      .left(2)
      .down(count - (type ? ++cur : --cur))
      .right(lastLen + 2)
  }

  ui.hideCursor()
  // Prevent user from writing.
  ui.rl.output.mute()
  
  return new Promise(function (resolve) {
    ui.on('keypress', function (value, key) {
      ui.rl.output.unmute()
      
      if (key && key.name === 'return') {
        ui.showCursor()
        ui.off('keypress')
        resolve(choises[cur])
        return
      }
      
      if (key && key.name === 'up') {
        if (cur > 0) {
          moveRender(0)
        }
      }
      
      if (key && key.name === 'down') {
        if (cur < count) {
          moveRender(1)
        }
      }
      
      ui.rl.output.mute()
    })
  })
}

/**
 * Clean and render list again.
 */
List.prototype.error = function (result) {
  const choises = this.config.choises
  
  this.ui.clean(choises.length)
  this.renderList()
  this.printError(result)
  this.ui
    .left(result.length)
    .up(1)
    .right(choises[choises.length - 1].length)
}

/**
 * Add `\n` to print.
 */
List.prototype.printError = function (message) {
  this.ui.write(`\n${chalk.red('!')} ${message}`)
}

/**
 * Clean list and print answer.
 */
List.prototype.finish = function () {
  const config = this.config
  
  this.ui
    .clean(config.choises.length)
    .up(1)
    .right(config.message.length + 4)
    
  this.printAnswer(this.answer)
}

module.exports = List
