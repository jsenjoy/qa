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
    validate: function (answer) {
      if (answer !== 'npm') {
        return 'Must be `npm`'
      } else {
        return true
      }
    },
    default: 'spm'
  })
  
  console.log(content)
})
