let counter = 0;
let color = [255, 255, 255];
var angle = 2.0;
var offset = 300;
var scalar = 3.5;
var speed = 0.1;
var col = {
  r: 255,
  g: 0,
  b: 0,
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  if (counter % 200 === 0) {
    color = [
      Math.random() * 155 + 100,
      Math.random() * 155 + 100,
      Math.random() * 155 + 100,
    ];
  }
  fill(color[0], color[1], color[2]);
  ellipse(mouseX, mouseY, 80, 80);
  counter++;
}
