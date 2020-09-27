const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const profileImg = document.getElementById('profile-img');
const username = document.getElementById('username');
const highscore = document.getElementById('highscore');
const popup = document.getElementById('popup-container');
const newGameBtn = document.getElementById('new-game');
const profile = document.getElementById('profile');
const ballBody = document.getElementById('ball-body');
const backArrow = document.getElementById('back-arrow');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

// const highscore =
//   localStorage.getItem('highscore') !== null ? localStorageHighscore : 0;

const localStorageHighscore = localStorage.getItem('highscore');

const brickRowCount = 9;
const brickColumnCount = 5;

const person = {};

// create ball orops
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
};

// create paddle prop
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

// create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

//draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '20px Ariel';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

//move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;
  // wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// .. Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  //   //wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //   console.log(ball.x, ball.y);

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    console.log('wut');
    ball.dy = -ball.speed;
  }

  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;

  if (score % (brickRowCount * brickRowCount === 0)) {
    showAllBricks();
  }
}

function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

//draw everything
function draw() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

//update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();
  //draw everything
  draw();
  requestAnimationFrame(update);
}

update();

// keydown
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

// keyup
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

function getHighScore() {}

function updateLocalStorage() {
  localStorage.setItem('highscore', highscore);
}

async function getRandomUser() {
  const res = await fetch('https://randomuser.me/api');
  const data = await res.json();

  const user = data.results[0];

  const newUser = {
    name: `${user.login.username}`,
    img: user.picture.large,
    highscore: 1000
  };
  console.log(user);
  console.log(newUser);
  const person = newUser;

  profileImg.src = newUser.img;
  username.innerText = newUser.name;
  highscore.innerText = newUser.highscore;
}
getRandomUser();

//keyboaard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
// rulesBtn.addEventListener('click', () => {
//   rules.classList.add('show');
// });
// closeBtn.addEventListener('click', () => {
//   rules.classList.remove('show');
// });
profile.addEventListener('click', () => {
  rules.classList.toggle('show');
});

backArrow.addEventListener('click', () => {
  popup.style.display = 'block';
});
newGameBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  ballBody.style.display = 'none';
});
