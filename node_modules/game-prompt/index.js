var prompt = require('prompt');

prompt.start();
prompt.message = '';
prompt.delimiter = '\n';

function simplePrompt(question, next) {
  if (next.length > 0) {
    prompt.delimiter = '\n=>';
  } else {
    prompt.delimiter = '\n';
  }
  prompt.get([{
    description: question,
    name: 'answer'
  }], function (error, result) {
    next(result.answer);
  });
}

function gamePrompt(prompts, next, answer) {
  if (!next) {
    next = function() {};
  }
  if (typeof prompts === 'string') {
    simplePrompt(prompts, next);
  } else if (prompts.length === 0) {
    next(answer);
  } else if (prompts.length === 1) {
    simplePrompt(prompts[0], next);
  } else {
    simplePrompt(prompts[0], function() {
      gamePrompt(prompts.splice(1), next, arguments[0]);
    });
  }
}

module.exports = gamePrompt;
