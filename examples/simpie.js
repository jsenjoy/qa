var qa = require('../')

qa(function *(ask) {
  var content = yield ask({
    name: 'name',
    message: 'What\'s your name',
    default: 'developer'
  })
  
  console.log(content)
  
  var number = yield ask({
    name: 'number',
    message: 'And what your telephone number',
    validate: function (number) {
      if (/\d{8,11}/.test(number)) {
        return true
      } else {
        return 'Please enter valid number'
      }
    }
  })
  
  console.log(number)
}).then(function (answers) {
  console.log(answers)
})
