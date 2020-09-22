const msgEl = document.getElementById('msg');
// const mymsgEl = document.getElementById('mymsg');

const randomNum = getRandomNumber();

console.log(randomNum);

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();

//start recognition
//      uncomment to start
// recognition.start();

function getRandomNumber() {
  return Math.floor(Math.random() * 1000000) + 1;
}

function onSpeak(e) {
  const msg = e.results[0][0].transcript;
  //   mymsgEl.innerText = msg;
  writeMessage(msg);
  checkNumber(msg);
}

function writeMessage(msg) {
  msgEl.innerHTML = `
    <div>You Said</div>
    <span class="box">${msg}</span>
    `;
}

function checkNumber(msg) {
  const num = +msg;
  //if valid number
  if (Number.isNaN(num)) {
    msgEl.innerHTML += '<div>That is not a valid number</div>';
    return;
  }

  // check i range
  if (num > 1000000 || num < 1) {
    msgEl.innerHTML += `<div>Number Must Be Between 1 & 100</div>`;
    return;
  }

  // cehck number
  if (num === randomNum) {
    document.body.innerHTML = `
      <h2>Congrats! You have guessed the number!
      <br>
      <br>
      It was ${num}</h2>
      <button class="play-again" id="play-again">Play Again</button>
      `;
  } else if (num > randomNum) {
    msgEl.innerHTML += '<div>GO LOWER!</div>';
  } else {
    msgEl.innerHTML += '<div>GO HIGHER!</div>';
  }
}

recognition.addEventListener('result', onSpeak);

recognition.addEventListener('end', () => recognition.start());

document.body.addEventListener('click', e => {
  if (e.target.id == 'play-again') {
    window.location.reload();
  }
});
