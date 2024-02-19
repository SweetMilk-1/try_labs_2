// Получаем Canvas
const disp = document.getElementById('game');
const ctx = disp.getContext('2d');

// Задаем основные параметры
const width = 400,
  height = 700;

const initSpeed = 2;
const fps = 60;

//Параметры Pipe
const windowSize = Math.round(height * 0.5   );
const pipeWidth = 50;

//Параметры Bird
const birdWidth = 45
const birdHeight = 35
const birdX = 50
const speedUp = 10
const accelerate = 0.8



//Загружаем спрайты
const topPipe = new Image();
const bottomPipe = new Image();
const flappyBird = new Image();
topPipe.src = 'toppipe.png';
bottomPipe.src = 'bottompipe.png';
flappyBird.src = 'flappybird.png';

// Класс трубы
class Pipe {
  constructor() {
    this.x = width + pipeWidth;
    this.y = Math.round((height - windowSize) * Math.random());
    this.isPassed = false
  }
  draw() {
    ctx.drawImage(
      topPipe,
      this.x,
      -height + this.y,
      pipeWidth,
      height
    );
    ctx.drawImage(
      bottomPipe,
      this.x,
      this.y + windowSize,
      pipeWidth,
      height
    );
  }

  isOutOfDisplay() {
    return this.x + pipeWidth <= 0;
  }

  move() {
    this.x -= speed;
    if (this.x + pipeWidth < birdX && !this.isPassed) {
      score++;
      this.isPassed = true
      if (score % 10 == 0)
        speed++;
    }
  }

  isTouchBird(bird) {
    return bird.x + birdWidth >= this.x && bird.x <= this.x + pipeWidth && (bird.y <= this.y || this.y + windowSize <= bird.y + birdHeight)
  }
}

// Класс птички
class Bird {
  constructor() {
    this.x = birdX
    this.y = height / 2
    this.v = speedUp
    this.a = 0.8
  }

  draw() {
    ctx.drawImage(
      flappyBird,
      this.x, 
      this.y,
      birdWidth,
      birdHeight
    );
  }

  move() {
    this.y -= this.v
    this.v -= accelerate
  }

  pressKey() {
    this.v = speedUp
  }

  isOutOfDisplay() {
    return this.y < 0 || this.y > height   
  }
}

bird = new Bird()
pipes = [];
let score = 0
let speed = 2;
//перемещает и отрисовывает объекты
function moveAndDrowPipesAndBird() {
  bird.draw()
  bird.move()

  pipes = pipes.filter((item) => !item.isOutOfDisplay());
  if (pipes.findIndex(item => item.x > width / 2) == -1) 
    pipes.push(new Pipe());

  for (const pipe of pipes) {
    pipe.move();
    pipe.draw();
  }
}

// true - если птица жива
function checkBirdHealth() {
  return !bird.isOutOfDisplay() && pipes.findIndex(pipe => pipe.isTouchBird(bird)) === -1  
}



function play() {
  setInterval(() => {
    ctx.clearRect(0, 0, width, height);

    if (!checkBirdHealth(bird, pipes)){
      bird = new Bird()
      pipes = [];
      score = 0;
      speed = initSpeed;
    }
    moveAndDrowPipesAndBird(pipes, bird)

    ctx.font = '72px "Silkscreen", sans-serif';
    ctx.fillText(score, 10, 60);
  }, 1000 / fps);


  document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      bird.pressKey();
    }
  })
}

play()