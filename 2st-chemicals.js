function setup() {
  createCanvas(document.body.scrollWidth, document.body.scrollHeight);
  textFont("Arial", 50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  frameRate(4);

  letters = ["S", "L", "U", "T"];
  directions = [1, 0];
  scle = 0.3;
  offsets = {
    x1: (320 / 2) * scle,
    y1: (340 / 2) * scle,
    x2: (320 / 2) * scle,
    y2: (340 / 2) * scle,
    x3: (320 / 2) * scle,
    y3: (340 / 2) * scle,
    x4: (320 / 2) * scle,
    y4: (340 / 2) * scle,
  };
  scalar = 325 * scle;
  wasBond = false;
  colors = ["#FF0000", "#51ff00", "#eeff00", "#00eeff", "#9900ff"];
}

function draw() {
  if (wasBond || random() > 0.2) {
    wasBond = false;
    hexagon(offsets.x1, offsets.y1, scle);
    hexagon(width - offsets.x2, height - offsets.y2, scle);
    hexagon(offsets.x3, height - offsets.y3, scle);
    hexagon(width - offsets.x4, offsets.y4, scle);
  } else {
    wasBond = true;
    horizontalBond(offsets.x1, offsets.y1, scle);
    horizontalBond(width - offsets.x2, height - offsets.y2, scle);
    horizontalBond(offsets.x3, height - offsets.y3, scle);
    horizontalBond(width - offsets.x4, offsets.y4, scle);
  }

  shuffledDirections = directions.sort(() => 0.5 - random());
  offsets.x1 = offsets.x1 + shuffledDirections[0] * scalar;
  offsets.y1 = offsets.y1 + shuffledDirections[1] * scalar;
  shuffledDirections = directions.sort(() => 0.5 - random());
  offsets.x2 = offsets.x2 + shuffledDirections[0] * scalar;
  offsets.y2 = offsets.y2 + shuffledDirections[1] * scalar;
  shuffledDirections = directions.sort(() => 0.5 - random());
  offsets.x3 = offsets.x3 + shuffledDirections[0] * scalar;
  offsets.y3 = offsets.y3 + shuffledDirections[1] * scalar;
  shuffledDirections = directions.sort(() => 0.5 - random());
  offsets.x4 = offsets.x4 + shuffledDirections[0] * scalar;
  offsets.y4 = offsets.y4 + shuffledDirections[1] * scalar;

  var difX = abs(mouseX - pmouseX);
  var difY = abs(mouseY - pmouseY);
  var vel = floor(difX + difY);
}

function horizontalBond(transX, transY, s) {
  shuffledLetters = letters.sort(() => 0.5 - random());

  fill(random(colors));
  stroke(0);
  strokeWeight(5);
  push();
  translate(transX, transY);
  scale(s);

  line(-150, 0, -60, 0);
  line(10, -30, 75 - 15, -130 + 30);
  line(10, 30, 75 - 15, 130 - 30);

  strokeWeight(2);
  random() > 0 ? text(shuffledLetters[2], 75, 140) : null;
  random() > 0 ? text(shuffledLetters[1], 75, -140) : null;
  text(shuffledLetters[3], -20, 0);
  pop();
}

function hexagon(transX, transY, s) {
  shuffledLetters = letters.sort(() => 0.5 - random());

  fill(random(colors));
  stroke(0);
  strokeWeight(5);
  push();
  translate(transX, transY);
  scale(s);

  topDouble = random() > 0.4;
  topDouble && random() > 0.7 ? line(-55, -107, 55, -107) : null; //rand
  topDouble ? line(-75, -130, 45, -130) : null;
  rightSingle = random() > 0.4;
  rightSingle ? line(75 + 15, -130 + 30, 150, 0) : null;

  rightDouble = random() > 0.4;
  rightDouble ? line(150, 0, 75 + 18, 130 - 30) : null;
  rightDouble && random() > 0.7 ? line(123, 0, 68, 95) : null; //rand
  bottomSingle = random() > 0.2;
  bottomSingle ? line(45, 130, -75, 130) : null;

  leftDouble = random() > 0.4;
  leftDouble ? line(-75, 130, -150 + 15, 0 + 30) : null;
  leftDouble && random() > 0.7 ? line(-65, 100, -122, 0) : null; //rand
  bottomSingle = random() > 0.4;
  bottomSingle ? line(-150 + 15, 0 - 30, -75, -130) : null;

  strokeWeight(1);
  topDouble || rightSingle ? text(shuffledLetters[0], 75, -130) : null;
  rightDouble || bottomSingle ? text(shuffledLetters[1], 75, 130) : null;
  bottomSingle || leftDouble ? text(shuffledLetters[2], -150, 0) : null;
  pop();
}
