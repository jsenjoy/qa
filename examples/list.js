var qa = require('../')

qa(function *(ask) {
  return yield ask({
    type: 'list',
    name: 'pm',
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
}).then(function (answers) {
  console.log(answers)
})
