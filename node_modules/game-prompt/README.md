# game-prompt

A dead simple prompt for command line based games.

## Installation

```
npm install --save game-prompt
```

## Usage

### Basic Usage

```javascript
// myGame.js
var gamePrompt = require('game-prompt');

function processAnswer(answer) {
  console.log('Hello ' + answer);
}

gamePrompt('What is your name?', processAnswer);
```

```
$ node myGame.js
What is your name?
=> Jacob
Hello Jacob
```

### Multipart Prompt

If you want to break up a prompt into several sections, pass an array as the first argument. The player can proceed to the next line by pressing enter.

```javascript
// myGame.js
var gamePrompt = require('game-prompt');

function processAnswer(answer) {
  console.log('Hello ' + answer);
}

gamePrompt([
  'Hello, welcome to the game',
  'What is your name?'
], processAnswer);
```

```
$ node myGame.js
Hello, welcome to the game

What is your name?
=> Jacob
Hello Jacob
```
