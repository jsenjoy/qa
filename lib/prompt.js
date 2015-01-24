var ttys = require('ttys')
var readline = require('readline')
var Questions = {
  input: require('./questions/input')
}


module.exports = {
  init: function () {
    this.interface = readline.createInterface({
      input: ttys.stdin,
      output: ttys.stdout
    })
    this.ttys = ttys
    this.answers = {}
  },
  ask: function (config) {
    if (!config) {
      throw new Error('Ask a question require question config')
    }
    config.type = config.type || 'input'
    var Question = Questions[config.type]
    var question = new Question(config)
    return question.run(this)
  },
  destroy: function () {
    this.interface.close()
    this.ttys.stdin.pause()
  },
  getAnswers: function () {
    return this.answers
  }
}
