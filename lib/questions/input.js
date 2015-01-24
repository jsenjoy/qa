var util = require('util')
var Base = require('./base')

function Input(config) {
  Base.call(this, config)
}

util.inherits(Input, Base)

module.exports = Input
