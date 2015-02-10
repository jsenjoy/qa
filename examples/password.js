var qa = require('../')

qa(function *(ask) {
  var pwd = yield ask({
    name: 'password',
    message: 'Enter your password',
    type: 'password'
  })
  
  console.log(pwd)
})
