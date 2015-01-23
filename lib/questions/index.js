/**
 * Produce a prompt function
 *
 * @param {Object} prompt The config to control prompt
 * @returns {Function}
 */
module.exports = function (prompt, handler) {
  // When type no support
  return require('./' + prompt.type)(prompt, handler)
}
