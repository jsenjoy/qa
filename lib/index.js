var co = require('co')
var prompt = require('./prompt')

var ask = function (config) {
  return prompt.ask(config)
}

/**
* Method to run a generator for interative command line program.
*
* @param {Generator} gen The generator to put program.
* @returns {Promise} The Promise to end program and take answers.
*/
var qa = function (gen) {
  prompt.init()
  var main = co.wrap(gen)
  
  var finish = function () {
    return prompt.answers
  }
  
  var error = function (error) {
    console.error(error.stack)
  }
  
  return main(ask).then(finish, error)
}

qa.ask = ask

module.exports = qa
