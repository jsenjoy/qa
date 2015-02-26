const UI = require('./ui')


const Prompts = {
  input: require('./prompts/input'),
  confirm: require('./prompts/confirm'),
  password: require('./prompts/password'),
  list: require('./prompts/list')
}

/**
 * Basic controller to init different prompt and take UI.
 *
 * @constructor
 */
function Controller () {
  this.ui = new UI()
  this.answers = {}
}

/**
 * Register prompt constructor.
 *
 * @static
 * @param {string} name
 * @param {Function} constructor
 * @returns {Object} Self
 */
Controller.register = function (name, constructor) {
  Prompts[name] = constructor
  return this
},

/**
 * Make and run a prompt.
 *
 * @param {Object} config - Prompt configure.
 * @param {string} config.type
 * @param {string} config.name
 * @param {string} config.message
 * @param {string|number|boolean} config.default
 * @param {Array} config.choices
 * @param {Function} config.validate
 * @param {Function} config.filter
 *
 * @returns {Promise}
 */
Controller.prototype.prompt = function (config) {
  if (!config) {
    throw new Error('Require prompt config')
  }
  
  if (!config.name) {
    throw new Error('Prompt require name')
  }
  
  const Prompt = Prompts[config.type || 'input']
  const prompt = new Prompt(this.ui, config)
  var controller = this
  return prompt.run().then(function (answer) {
    return (controller.answers[config.name] = answer)
  })
},

/**
 * Close ui.
 */
Controller.prototype.destroy = function () {
  this.ui.close()
}

module.exports = Controller
