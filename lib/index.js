var co = require('co')
var readline = require('readline')
var index = require('./questions/index')

/**
 * Method to run a generator for interative command line program.
 *
 * @param {Generator} gen The generator to put program.
 * @returns {Promise} The Promise to end program and take answers.
 */
module.exports = function (gen) {
  
  // Take the readline interface and record answers
  var handler = {
    interface: readline.createInterface({
      input: process.stdin,
      output: process.stdout
    }),
    answers: {}
  }
  
  var main = co.wrap(gen)
  
  main(function (prompt) {
    return index(prompt, handler)
  }).then(function () {
    handler.interface.close()
    return handler.answers
  })
}
