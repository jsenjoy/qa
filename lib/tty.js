/**
 * TTY mixin.
 * Almost entirely from: https://github.com/SBoudrias/Inquirer.js/blob/master/lib/utils/tty.js
 */
 
const _ = require('./utils')
const readline = require('readline')
const cliWidth = require('cli-width')

module.exports = {
  /**
   * Remove the line.
   *
   * @params {number} len Lines to remove.
   * @returns {Object} Self.
   */
  clean: function (len) {
    _.isNumber(len) || (len = 1)
    
    while (len--) {
      readline.moveCursor(this.rl.output, -cliWidth(), 0)
      readline.clearLine(this.rl.output, 0)
      if (len) {
        readline.moveCursor(this.rl.output, 0, -1)
      }
    }
    return this
  },
  
  /**
   * Remove after the cursor.
   *
   * @returns {Object} Self.
   */
  cleanAfter: function () {
    readline.clearLine(this.rl.output, 1)
    return this
  },
  
  /**
   * Move cursor down.
   *
   * @param {number} x How far to go down (default to 1).
   * @return {Object} Self.
   */
  down: function (x) {
    _.isNumber(x) || (x = 1)
     
    // @bug: Write new lines instead of moving cursor as unix system don't allocate a new
    // line when the cursor is moved over there.
    while (x--) {
      this.write("\n")
    }
     
    return this
  },
   
  /**
   * Move cursor up.
   *
   * @param {number} x How far to go up (default to 1).
   * @return {Object} Self.
   */
  up: function (x) {
    _.isNumber(x) || (x = 1)
    readline.moveCursor(this.rl.output, 0, -x)
    return this
  },
  
  /**
   * Move cursor left.
   *
   * @param {number} x How far to go left (default to 1).
   * @returns {Object} Self.
   */
  left: function (x) {
    return this.right(-x)
  },
  
  /**
   * Move cursor right.
   *
   * @param {number} x How far to go right (default to 1).
   * @returns {Object} Self.
   */
  right: function (x) {
    _.isNumber(x) || (x = 1)
    readline.moveCursor(this.rl.output, x, 0)
    return this
  },
  
  /**
   * Move cursor to head of the line.
   *
   * @return {Object} Self.
   */
  head: function () {
    this.left(this.rl._getCursorPos().cols)
    return this
  },
  
  /**
   * Write something to output.
   *
   * @param {string} str
   * @returns {Object} Self.
   */
  write: function (str) {
    this.rl.output.write(str)
    return this
  },
  
  /**
   * Hide cursor.
   * @returns {Object} Self.
   */
  hideCursor: function () {
    return this.write("\x1B[?25l")
  },
  
  /**
   * Show cursor.
   * @returns {Object} Self.
   */
  showCursor: function () {
    return this.write("\x1B[?25h")
  },
  
  /**
   * Remember the cursor position.
   * @returns {Object} Self.
   */
  cacheCursorPos: function() {
    this.cursorPos = this.rl._getCursorPos()
    return this
  },
  
  /**
   * Restore the cursor position to where it has been previously stored.
   * @return {Object} Self.
   */
  restoreCursorPos: function () {
    if (!this.cursorPos) {
      return this
    }
    var line = this.rl._prompt + this.rl.line
    readline.moveCursor(this.rl.output, -line.length, 0)
    readline.moveCursor(this.rl.output, this.cursorPos.cols, 0)
    this.cursorPos = null
    return this
  }
}
