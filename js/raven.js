export class Raven {
  constructor(canvas) {
    this.canvas = canvas;
    this.spriteWidth = 439;
    this.spriteHeight = 599;
    this.sizeModifier = Math.random() * 0.1 + 0.2;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "../images/gost.png";
    this.frame = 0;
    this.maxFrame = 29;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 25 + 25;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color = `rgba(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
  }

  update(deltaTime, gameOverCallback) {
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.y < 0 || this.y > this.canvas.height - this.height) {
      this.directionY *= -1;
    }
    //if object has passed all the way left has
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
    if (this.x < 0 - this.width) gameOverCallback();
  }

  draw(ctx, collisionCtx) {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
