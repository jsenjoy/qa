var co = require('co')
var readline = require('readline')
var index = require('./questions/index')

/**
 * Method to run a generator for interative command line program.
 *
 * @param {Generator} gen The generator to put program.
 * @returns {Promise} The Promise to end program.
 */
module.exports = function (gen) {
  
  var handler = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  var main = co.wrap(gen)
  
  main(function (prompt) {
    return index(prompt, handler)
  }).then(function (answers) {
    handler.close()
    return answers
  })
}
