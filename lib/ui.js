const ttys = require('ttys')
const readline = require('readline2')
const _ = require('./utils')

/**
 * UI delegated events cache.
 */
const noop = _.noop
var _events = {
  line: noop,
  keypress: noop
}

/**
 * UI constructor, to create ui to control IO.
 *
 * @constructor
 * @param {Stream} [input]
 * @param {Stream} [output]
 */
function UI (input, output) {
  this.rl = readline.createInterface({
    input: input || ttys.stdin,
    output: output || ttys.stdout
  })
  
  // Delegated events bind.
  this.onLine = (function onLine () {
    _events.line.apply(this, arguments)
  }).bind(this)
  
  this.onKeypress = (function onKeypress () {
    if (this.rl) {
      _events.keypress.apply(this, arguments)
    }
  }).bind(this)
  
  this.forceClose = this.forceClose.bind(this)
  
  this.rl.addListener('line', this.onLine)
  this.rl.input.addListener('keypress', this.onKeypress)
  
  this.rl.on('SIGINT', this.forceClose)
  process.on('exit', this.forceClose)
}

/**
 * Extends UI prototype.
 */
UI.prototype = _.assign({
  /**
   * Add only one callback listener.
   *
   * @param {string} event Event name.
   * @param {Function} callback What will run when emits from now.
   * @returns {Object} Self.
   */
  on: function (event, callback) {
    _events[event] = callback
    return this
  },
  
  /**
   * Remove current callback.
   *
   * @param {string} event Event name.
   * @returns {Object} Self.
   */
  off: function (event) {
    _events[event] = noop
  },
  
  /**
   * Clean up `readline` interface and input/output.
   */
  close: function () {
    // Remove events listners
    this.rl.removeListener('SIGINT', this.forceClose)
    this.rl.removeListener('line', this.onLine)
    this.rl.input.removeListener('keypress', this.onKeypress)
    process.removeListener('exit', this.forceClose)
    
    // Restore prompt functionnalities
    this.rl.output.unmute()
    this.rl.output.write("\x1B[?25h") // show cursor

    // Close the readline
    this.rl.output.end()
    this.rl.pause()
    this.rl.close()
    this.rl = null
  },
  
  /**
   * Handle the ^C exit
   */
  forceClose: function () {
    this.close()
    console.log('\n')
  }
}, require('./tty'))

module.exports = UI
