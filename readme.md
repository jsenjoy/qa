# qa

Yet an other collection of interactive command line user interfaces base on generator.

## Document

### Installation

```shell
npm install qa
```

```js
var qa = require('qa')

qa(function *(ask) {
  if (yield ask({
    name: 'like',
    type: 'confirm',
    message: 'Do you like qa ?'
    })) {
    var reason = yield ask({
      name: 'reason',
      type: 'input',
      message: 'And why ?'
    })
    console.log('Thank you! I know why now.')
    console.log('Because: ' + reason)
  } else {
    var suggestion = yield ask({
      name: 'suggestion',
      type: 'input',
      message: 'Have suggestion ?'
    })
    console.log('Thank you!')
    console.log('I will try my best to: ' + suggestion)
  }
}).then(function (answers) {
  console.log(answers) // { like: true, ... }
})
```

### Methods

#### Main

`qa(Generator)`

Run an interative command line program using a generator. The generator will be given functional arguments:

- **ask** (Function)  
  It will prompt a question and using `yield` to take answer.
  Accept an argument (Object) to control prompt, options: (retain question object in `Inquirer.js`, it's wonderful practice.)
  
  - **type**: (String) Type of prompt, default: input - Possible values: confirm, list, rawlist, password.
  - **name**: (String) Answer's key in answers hash.
  - **message**: (String) The question to print.
  - **default**: (String|Number|Array) Default value(s) to use if nothing is entered.
  - **choices**: (Array) Choices array.
  - **validate**: (Function) Receive the user input and should return true if the value is valid, or return error message to print.
  - **filter**: (Function) Receive the user input and return the filtered value to be used inside the program.
  
  *Remove some function type support to be more simple*
  
#### Answers

`qa(gen).then(function (answers) { ... })`

Run `qa` will return promise which can get a key/value hash containing the client answers.

- **Key** The `name` property of the question object.
- **Value** The answer for specified question, can be `Boolean`(confirm), `String`(input, rawlist, list).
