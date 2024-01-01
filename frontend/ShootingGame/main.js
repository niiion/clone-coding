// canvas setting
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width= 400;
canvas.height=700;
document.body.appendChild(canvas);

let spaceImage, rocketImage, alienImage, gameOverImage;
let gameover = false; // 트루이면 게임 끝, 펄스면 게임 진행
let score=0;
  
// rocket 좌표
let rocketX = canvas.width/2-30;
let rocketY = canvas.height-60;

let bulletList = [] // 총알들 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function() {
    this.x = rocketX + 6;
    this.y = rocketY;
    this.alive=true; // 트루면 살아있, 펄스면 죽은 총알
    bulletList.push(this);
  };

  this.update = function() {
    this.y -= 7;
  };

  this.checkHit=function() {
    // 총알.와이 <= 적군.와이 앤드
    // 총알.엑스 >= 적군.엑스 앤드 총알.엑스 + 적군의 넓이
    for(let i=0; i < enemyList.length;i++) {
      if(this.y <= enemyList[i].y &&
        this.x>=enemyList[i].x &&
        this.x<=enemyList[i].x+55) {
          // 총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
          score++;
          this.alive=false;
          enemyList.splice(i, 1);
        }
    }
  }
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random()*(max - min + 1)) + min;
  return randomNum;
}

let enemyList = []
function enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function() {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 60);
    enemyList.push(this);
  };
  this.update = function() {
    this.y += 10; 

    if(this.y >= canvas.height-55) {
      gameover = true;
      console.log("gameover");
    }
  }
}

function loadImage() {
  spaceImage = new Image();
  spaceImage.src= "img/space.png";

  rocketImage = new Image();
  rocketImage.src= "img/rocket.png";

  bulletImage = new Image();
  bulletImage.src = "img/bullet.png"

  alienImage = new Image();
  alienImage.src= "img/alien.png";

  gameOverImage = new Image();
  gameOverImage.src= "img/gameover.png";

}

let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function(event) {
    keysDown[event.key] = true; 
    console.log("키다운 객체에 들어간 키:", keysDown);
  });  
  document.addEventListener("keyup", function() {
    delete keysDown[event.key];
    console.log("키업 객체에 들어간 키:", keysDown);

    if(event.key == " ") {
      createBullet() // 총알 생성
    }
  }); 
}  

function createBullet() {
  console.log("총알 생성");
  let b = new Bullet();
  b.init();
  console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() {
  const interval = setInterval(function() {
    let e = new enemy();
    e.init();
  },1000);
}

function update() {
  if("ArrowRight" in keysDown) {
    rocketX += 5;
  }
  if("ArrowLeft" in keysDown) {
    rocketX -= 5;
  }
  if("ArrowDown" in keysDown) {
    rocketY += 5;
  }
  if("ArrowUp" in keysDown) {
    rocketY -= 5;
  }

  // 로켓의 좌표값이 경기장 안에서만 있게 함
  if(rocketX <= 0) {
    rocketX = 0;
  }
  if(rocketX >= canvas.width - 60) {
    rocketX = canvas.width - 60;
  }
  if(rocketY >= canvas.height - 60) {
    rocketY = canvas.height - 60;
  }
  if(rocketY <= 400) {
    rocketY = 400;
  }
  
  // 총아릐 y표 업데이트하는 함수 호출
  for(let i=0; i < bulletList.length; i++) {
    if(bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for(let i = 0; i < enemyList.length;i++) {
    enemyList[i].update();
  }
}

function render() {      
  ctx.drawImage(spaceImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(rocketImage, rocketX, rocketY);
  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle="white";
  ctx.font = "15px Arial";

  for(let i = 0; i < bulletList.length; i++) {
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y, 35, 38);
    }
  }

  for(let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(alienImage, enemyList[i].x, enemyList[i].y, 55, 55);
  }
}    

function main() {
  if(!gameover) {
    update(); // 좌표값 업데이트
    render();
    console.log("animation calls main function");
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 0, 120, 380, 380);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
    
// 방향키를 누르면
// 로켓의 xy 좌표가 바뀌고
// 다시 그려줌

// 총알 만들기
// 스페이스바를 누르면 총알 발사
// 총알이 --. 총알의 x 좌표는 스페이스를 누른 순간 로캣의 x 좌표
// 발사된 총알들은 총알 배열에 저장
// 총알들은 x, y 좌표값이 있어야함
// 총알 배열을 가지고 렌더.

// 적군 만들기
// 징글귀염, x, y, init, update
// 외계인의 위치가 랜덤
// 외계인은 밑으로 내려옴
// 1초마다 한마리씩 나옴
// 외계인이 바닥에 닿으면 게임 오버
// 적군과 총알이 만나면 우주선이 사라짐 점수 1점 획득

// 적군이 죽는다
// 총알.y <= 적군.y And
// 총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이

// 닿았다

// 총알이 죽게됨 적군의 우주선이 없어지고 점수 획득
