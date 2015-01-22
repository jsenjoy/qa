var co = require('co')
var thunkify = require('thunkify')
var index = require('./questions/index')

/**
 * Method to run a generator for interative command line program.
 *
 * @param {Generator} gen The generator to put program.
 * @returns {Promise} The Promise to end program.
 */
module.exports = function (gen) {
  return co(gen)(function (prompt) {
    return thunkify(index(prompt))
  })
}
