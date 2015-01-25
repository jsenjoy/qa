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
  
  return main(function (config) {
    return prompt.ask(config)
  }).then(function () {
    var answers = prompt.getAnswers()
    prompt.destroy()
    return answers
  }, function (error) {
    console.error(error.stack)
  })
  
}
