# qa

Yet an other collection of interactive command line user interfaces base on generator.

## Document

### Installation

### Example
```js
var qa = require('qa')

qa.run(function *(ask) {
  if (yield ask('confirm', 'Do you like qa ?')) {
    var reason = yield ask('input', 'And why ?')
    console.log('Thank you! I know why now.')
    console.log('Because: ' + reason)
  } else {
    var suggestion = yield ask('input', 'Have suggestion ?')
    console.log('Thank you!')
    console.log('I will try my best to: ' + suggestion)
  }
})
```

### Methods

`qa.run(generator)`

Run an interative command line program using a generator. The generator will be given functional arguments:

- ask (function)  
  It will prompt a question and using `yield` to take answer.
  Accept an argument (object) to control prompt, options:
  
  - type
  - name
  - message
  - default
  - choices
  - validate
  - filter
  
  
  
