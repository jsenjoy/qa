/**
 * Simple events delegate, to provide input/output events hanlder.
 */
 
var noop = function () {}
var eventsMap = {
  line: noop
}

module.exports = {
  /**
   * Mainli events bind to readline.
   */
  bind: function (prompt) {
    this.rl.on('line', function () {
      eventsMap.line.apply(prompt, arguments)
    })
    return this
  },
  /**
   * Add only one callback listener.
   *
   * @param {String} event Event name.
   * @param {Function} callback What will run when emits from now.
   * @returns {Object} Self.
   */
  on: function(event, callback) {
    eventsMap[event] = callback
    return this
  },
  /**
   * Remove current callback.
   *
   * @param {String} event Event name.
   * @returns {Object} Self.
   */
  off: function (event) {
    eventsMap[event] = noop
    return this
  }
}
