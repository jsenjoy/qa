var ttys = require('ttys')
var readline = require('readline')
var events = require('./events')
var tty = require('./tty')
var _ = require('./utils')

/**
 * Maps of questions type/constructor
 */
var Questions = {
  input: require('./questions/input'),
  confirm: require('./questions/confirm'),
  password: require('./questions/password')
}

/**
 * Prompt UI instance, provide basic command line control.
 */
module.exports = _.extend({
  /**
   * Init prompt ui, mainly create `readline` interface and answers record.
   */
  init: function () {
    this.rl = readline.createInterface({
      input: ttys.stdin,
      output: ttys.stdout
    })
    this.answers = {}
    this.bind()
  },
  /**
   * Create a question instance and run it.
   *
   * @param {Object} config Configure of question which will be created.
   * @returns {Promise} What question run to return, to resolve the answer.
   */
  ask: function (config) {
    if (!config) {
      throw new Error('Ask a question require question config')
    }
    config.type = config.type || 'input'
    var Question = Questions[config.type]
    var question = new Question(this, config)
    return question.run()
  },
  /**
   * Clean up `readline` interface and input/output.
   */
  destroy: function () {
    this.rl.close()
    this.rl.input.pause()
  }
}, events, tty)
