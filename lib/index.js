var co = require('co')
var prompt = require('./prompt')

/**
 * Method to run a generator for interative command line program.
 *
 * @param {Generator} gen The generator to put program.
 * @returns {Promise} The Promise to end program and take answers.
 */
module.exports = function (gen) {
  prompt.init()
  var main = co.wrap(gen)
  
  var ask = function (config) {
    return prompt.ask(config)
  }
  
  var finish = function () {
    return prompt.answers
  }
  
  var error = function (error) {
    console.error(error.stack)
  }
  
  return main(ask).then(finish, error)
}
