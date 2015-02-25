var qa = require('../')

qa(function *(ask) {
  var content = yield ask({
    type: 'list',
    name: 'name',
    message: 'Which package manager do you need',
    choises: [
      'spm',
      'npm',
      'bower'
    ],
    default: 'spm'
  })
  
  console.log(content)
})
