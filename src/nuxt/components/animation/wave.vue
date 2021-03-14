<template>
  <div id="loading-text">Loading ...</div>
</template>

<script>
class Point {
  // points for wave
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 0.1;
    this.cur = index; //0;
    this.max = Math.random() * 100 + 150;
  }

  update() {
    //! 아래 위로 움직인다?
    // Mathi.sin 덕분에 -max ~ +max 사이로 bound
    this.cur += this.speed; // 무한히 커지는 단점이 있음.
    this.y = this.fixedY + Math.sin(this.cur) * this.max;
  }
}

class WaveGroup {
  constructor() {
    this.totalWaves = 3;
    this.totalPoints = [6, 11, 12];

    this.color = [
      'rgba(204, 255, 221, 0.4)',
      'rgba(255, 128, 170, 0.4)',
      'rgba(153, 204, 255, 0.4)',
    ];

    this.waves = [];

    for (let i = 0; i < this.totalWaves; i++) {
      const wave = new Wave(
        i, // i번째 wave
        this.totalPoints[i], // 주기를 나타냄.
        this.color[i]
      );
      this.waves[i] = wave;
    }
  }

  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.resize(stageWidth, stageHeight);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.draw(ctx);
    }
  }
}

class Wave {
  constructor(index, totalPoints, color) {
    //console.log("wave")
    this.index = index;
    this.totalPoints = totalPoints; // num
    this.color = color;
    this.points = [];
  }
  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.centerX = stageWidth / 2;
    this.centerY = stageHeight / 2;

    this.pointGap = this.stageWidth / (this.totalPoints - 1);

    this.init();
    //console.log("init")
  }

  init() {
    this.points = [];
    // N개의 point 생성
    for (let i = 0; i < this.totalPoints; i++) {
      const point = new Point(
        this.index + i, // this.index = parent wave idx
        this.pointGap * i, //this.centerX,
        this.centerY
      );
      //console.log("point")
      this.points[i] = point;
      //this.points.push(point);
    }
  }

  draw(ctx) {
    // 원 색 채우기
    ctx.fillStyle = this.color; //'#ff0000';
    // ctx.fill();

    // 원 그리기
    ctx.beginPath();

    let prevX = this.points[0].x;
    let prevY = this.points[0].y;

    ctx.moveTo(prevX, prevY);

    for (let i = 1; i < this.totalPoints; i++) {
      // //console.log(i)
      if (i < this.totalPoints - 1) {
        // ctx.arc(this.points[i].x, this.points[i].y, 10, 0, 2*Math.PI);
        this.points[i].update();
      }

      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      ctx.quadraticCurveTo(prevX, prevY, cx, cy);

      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    ctx.lineTo(prevX, prevY);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.stageHeight);
    ctx.fill();
    ctx.closePath();

    // this.points[0].update();
  }
}

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('wave-animation');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // fillText(text, x, y)
    // fillText(출력할 텍스트, 시작 x좌표, 시작 Y좌표)
    //! text 출력
    // this.ctx.font = "20px malgun gothic"; //폰트의 크기, 글꼴체 지정
    // this.ctx.fillStyle = "rgba(255,0,255,1)"; //색상지정
    // this.ctx.fillText("자바킹 블로그",10,10);
    // this.ctx.textAlign = "center"

    // // strokeText(text, x, y, maxWidth)
    // // strokeText(출력할 텍스트, 시작 x좌표, 시작 Y좌표, maxWidth)

    // this.ctx.font = "30px verdana";
    // this.ctx.strokeStyle = "blue"; //테두리 색상
    // this.ctx.strokeText("JavaKing Blog",5,130);

    this.waveGroup = new WaveGroup();

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
    //! Q. animation 서로 부르는 형태로? 재귀?
    // 1초에 60번 동작 -> 비동기적으로 하기위해 callback 전달
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
    // console.log(this.stageWidth, this.stageHeight); // 700, 460

    /* CSS 말고 tag 속성을 바꾸면 drawing area를 바꾸는 거임*/
    this.canvas.width = this.stageWidth; // 840
    this.canvas.height = this.stageHeight; //413
    // this.ctx.scale(2, 2); => 이걸 도대체 왜 한거지?

    this.waveGroup.resize(this.stageWidth, this.stageHeight);
  }
  animate() {
    // 캔버스 전체영역 지우기
    // console.log("here")
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.waveGroup.draw(this.ctx); // 갱신된 위치가 그려짐.
    requestAnimationFrame(this.animate.bind(this));
  }
}

export default {
  mounted() {
    new App();
  },
  destroyed() {
    console.log('remove wave component');
  },
};
</script>

<style>
* {
  user-select: none;
  -ms-user-select: none;
  outline: 0;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  background-color: #ffffff;
  /* background-color: red; */
  display: flex;
  /* flex-con */
}

canvas.wave-animation {
  margin: auto;
  /*canvas element size*/
  /*drawing area 비례적으로 존재함.*/
  width: 280px;
  height: 280px;
  border: 2px solid rgb(160, 159, 159);
  border-radius: 50%;
  background: white;
}

@media (max-width: 500px) {
  canvas.wave-animation {
    width: 250px;
    height: 250px;
  }
}

/* span.vertex {
  position: absolute;
} */

#loading-text {
  font-size: 17px;
  position: absolute;
  top: 60vh;
  left: 50.5vw;
  /* top: 67%; 
  left: 56%;*/
}

canvas.wave-animation {
  position: absolute;
  top: 30vh;
  left: 45vw;
}
</style>
