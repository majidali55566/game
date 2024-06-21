import { Raven } from "./raven.js";
import { Explosion } from "./explosion.js";

const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext("2d", { willReadFrequently: true });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById("collisionCanvas");

const collisionCtx = collisionCanvas.getContext("2d", {
  willReadFrequently: true,
});
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let ravens = [];
let explosions = [];

let score = 0;
let gameOver = false;

function gameOverCallback() {
  gameOver = true;
}

// ----responsive canvas
function resizeCanvas() {
  canvas.width = collisionCanvas.width = window.innerWidth;
  canvas.height = collisionCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
// ----responsive canvas // ---
canvas.addEventListener("click", (event) => {
  // const rect = collisionCanvas.getBoundingClientRect();
  // const x = event.clientX - rect.left;
  // const y = event.clientY - rect.top;
  // const detectedPixelColor = collisionCtx.getImageData(x, y, 1, 1).data;
  // ravens.forEach((raven) => {
  //   if (
  //     detectedPixelColor[0] === raven.randomColors[0] &&
  //     detectedPixelColor[1] === raven.randomColors[1] &&
  //     detectedPixelColor[2] === raven.randomColors[2]
  //   ) {
  //     raven.markedForDeletion = true;
  //     score++;
  //   }
  // });

  const detectedPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
  const pc = detectedPixelColor.data;
  ravens.forEach((raven) => {
    if (
      raven.randomColors[0] === pc[0] &&
      raven.randomColors[1] === pc[1] &&
      raven.randomColors[2] === pc[2]
    ) {
      //collisions detected
      raven.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(raven.x, raven.y, raven.width));
      console.log(explosions);
    }
  });
});

//draw score
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "50px sans-serif";
  ctx.fillText(`Score :` + score, 50, 75);
}
function drawGameOver() {
  const text = `Game Over! Score: ${score}`;
  const fontSize = 50;
  const padding = 20;

  ctx.font = `${fontSize}px sans-serif`;
  const textWidth = ctx.measureText(text).width;
  const rectWidth = textWidth + padding * 2;
  const rectHeight = fontSize + padding * 2;

  const rectX = (canvas.width - rectWidth) / 2;
  const rectY = (canvas.height - rectHeight) / 2;

  ctx.textAlign = "center";

  // Draw background rectangle
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Background color with some transparency
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

  // Draw game over text
  ctx.fillStyle = "white"; // Text color
  ctx.fillText(text, canvas.width / 2, rectY + rectHeight / 2 + fontSize / 3);
}

function animate(timestamp) {
  if (gameOver) {
    drawGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;

  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven(canvas));
    timeToNextRaven = 0;
    ravens.sort((a, b) => a.width - b.width);
  }
  drawScore(ctx);
  [...ravens].forEach((obj) => obj.update(deltaTime, gameOverCallback));
  [...explosions].forEach((obj) => obj.update(deltaTime));
  [...ravens].forEach((obj) => obj.draw(ctx, collisionCtx));
  [...explosions].forEach((obj) => obj.draw(ctx));
  // filtering out objects that are passed all the way screen
  ravens = ravens.filter((obj) => !obj.markedForDeletion);
  explosions = explosions.filter((obj) => !obj.markedForDeletion);
  requestAnimationFrame(animate);
}

animate(0);
