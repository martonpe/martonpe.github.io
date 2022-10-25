let counter = 0;
let color = [255, 255, 255];

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
    // fill(r, g, b);
  } else {
    // fill(255);
  }
  fill(color[0], color[1], color[2]);
  ellipse(mouseX, mouseY, 80, 80);
  counter++;
}
