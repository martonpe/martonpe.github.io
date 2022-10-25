let counter = 0;
let color = [255, 255, 255];
var angle = 2.0;
var offsetX = window.innerWidth / 2;
var offsetY = window.innerHeight / 6;
var radius = 0;
var scalar = 3.5;
var speed = 1;
var col = {
  r: 255,
  g: 0,
  b: 0,
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  if (counter % 100 === 0) {
    color = [
      Math.random() * 155 + 100,
      Math.random() * 155 + 100,
      Math.random() * 155 + 100,
    ];
  }
  var x = offsetX + cos(angle) * scalar;
  var y = offsetY + sin(angle) * scalar;
  fill(color[0], color[1], color[2]);
  ellipse(x, y, 80, 80);
  counter++;
  angle += speed;
  scalar += speed;
}
