var _ = require('lodash')

function Base(config) {
  _.extend(this, config)
}

Base.prototype.run = function (prompt) {
  var base = this
  return new Promise(function (resolve) {
    prompt.interface.question(base.message, function (answer) {
      prompt.answers[base.name] = answer
      resolve(answer)
    })
  })
  
}

module.exports = Base
