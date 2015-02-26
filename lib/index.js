const co = require('co')
const Controller = require('./controller')

/**
 * Prompt use not in `qa`, provide new constroller to take.
 *
 * @param {Object} config
 * @returns {Promise}
 */
function prompt (config) {
  const controller = new Controller()
  return controller
    .prompt(config)
    .then(function (answer) {
      controller.destroy()
      return answer
    })
}

/**
 * Register new type prompt.
 *
 * @param {string} name Prompt name.
 * @param {Function} constructor Prompt constructor.
 * @returns
 */
function register (name, constructor) {
  Controller.register(name, constructor)
}

/**
 * Method to run a generator for interative command line program.
 *
 * @param {Generator} gen The generator to put program.
 * @returns {Promise} The Promise to end program and take answers.
 */
var qa = function (gen) {
  var main = co.wrap(gen)
  const controller = new Controller()
  
  function finish () {
    controller.destroy()
    return controller.answers
  }
  
  function error (error) {
    console.error(error.stack)
  }
  
  return main(function (config) {
    return controller.prompt(config)
  }, register).then(finish, error)
}

qa.prompt = prompt
qa.register = register

module.exports = qa
  
