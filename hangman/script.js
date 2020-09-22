const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const finalMessageRevealWord = document.getElementById(
  'final-message-reveal-word'
);

const figureParts = document.querySelectorAll('.figure-part');

const words = [
  'application',
  'programming',
  'interface',
  'wizard',
  'abstraction',
  'argument',
  'array',
  'assignment',
  'attribute',
  'backend',
  'binary',
  'boolean',
  'byte',
  'bytecode',
  'class',
  'closure',
  'comment',
  'compiler',
  'concatenation',
  'conditional',
  'convention',
  'debug',
  'declaration',
  'decorator',
  'dictionary',
  'docstring',
  'encapsulation',
  'encoding',
  'exception',
  'expression',
  'framework',
  'function',
  'global',
  'identifier',
  'immutable',
  'inheritance',
  'inheritance',
  'input',
  'instance',
  'instantiation',
  'interpreter',
  'iteration',
  'iterator',
  'library',
  'list',
  'loop',
  'method',
  'mutable',
  'namespace',
  'object',
  'parameter',
  'pointer',
  'polymorphism',
  'pseudocode',
  'quicksort',
  'random',
  'recursion',
  'runtime',
  'runtime',
  'scope',
  'slice',
  'stack',
  'statement',
  'struct',
  'syntax',
  'tuple'
];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
      )
      .join('')}
  `;

  const innerWord = wordEl.innerText.replace(/[ \n]/g, '');

  if (innerWord === selectedWord) {
    finalMessage.innerText = 'Congratulations! You won! 😃';
    finalMessageRevealWord.innerText = ``;
    popup.style.display = 'flex';

    playable = false;
  }
}

updateWrongLettersEl = () => {
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
  ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = 'Unfortunately you lost. 😕';
    finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
    popup.style.display = 'flex';

    playable = false;
  }
};
showNotification = () => {
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

//Keydown letter press
window.addEventListener('keydown', e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

playAgainBtn.addEventListener('click', () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  displayWord();
  updateWrongLettersEl();

  popup.style.display = 'none';
});

displayWord();
