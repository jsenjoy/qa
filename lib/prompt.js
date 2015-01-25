var ttys = require('ttys')
var readline = require('readline')
var events = require('./events')
var _ = require('lodash')

/**
 * Maps of questions type/constructor
 */
var Questions = {
  input: require('./questions/input')
}

/**
 * Prompt UI instance, provide basic command line control.
 */
module.exports = _.extend({
  /**
   * Init prompt ui, mainly create `readline` interface and answers record.
   */
  init: function () {
    this.interface = readline.createInterface({
      input: ttys.stdin,
      output: ttys.stdout
    })
    this.ttys = ttys
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
    var question = new Question(config)
    return question.run(this)
  },
  /**
   * Clean up interface and input/output.
   */
  destroy: function () {
    this.interface.close()
    this.ttys.stdin.pause()
  },
  /**
   * Get answers key/value hash
   *
   * @returns {Object}
   */
  getAnswers: function () {
    return this.answers
  }
}, events)
