var qa = require('../')

qa(function* (ask) {
  var like = yield ask({
    name: 'like',
    type: 'confirm',
    message: 'Do you like qa',
    default: true
  })
  
  console.log(like)
})
