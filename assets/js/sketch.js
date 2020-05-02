// Coding Challenge 130.3: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
// https://youtu.be/7_vKzcgpfvU
// https://editor.p5js.org/codingtrain/sketches/ldBlISrsQ

let x = [];
let fourierX;
let time = 0;
let path = [];
let dt;
let poppedFourierX = [];
let speedFactor = 1;

function setup() {
  createCanvas(1166 ,838);
  //=song = loadSound('sound.m4a');
 ele = createAudio('/assets/js/silence.mp3');
   ele.autoplay(true);

  const skip = 10;
  for (let i = 0; i < drawing.length; i += skip) {
    const c = new Complex(drawing[i].x, drawing[i].y);
    x.push(c);
  }
  fourierX = dft(x);
  fourierX.sort((a, b) => b.amp - a.amp);

}

function epicycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(139,0,0);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function draw() {
  background(0);
  //song.play()

  let v = epicycles(width / 2, height / 2, 0, fourierX);
  path.unshift(v);

  beginShape();
  noFill();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape();

  dt = TWO_PI / (fourierX.length + poppedFourierX.length) * speedFactor;
  time += dt;

  if (time > TWO_PI) {
    noLoop();
    time = 0;
    path = [];
  }
}



function keyPressed() {
  path = [];
  time = 0;
  if (keyCode === LEFT_ARROW) {
		if (fourierX.length === 1) return 
    poppedFourierX.push(fourierX.pop());
    console.log(fourierX.length + " epicycles are running");
  }
  else if (keyCode === RIGHT_ARROW) {
		if (poppedFourierX.length === 0) return 
    fourierX.push(poppedFourierX.pop());
    console.log(fourierX.length + " epicycles are running");
  }
  else if (keyCode === DOWN_ARROW) {
    speedFactor *= 0.9;
		speedFactor = floor(speedFactor * 10000) / 10000;
		console.log("speed factor is " + speedFactor)
  }
  else if (keyCode === UP_ARROW) {
    speedFactor *= 1.1;
		speedFactor = floor(speedFactor * 10000) / 10000;
		console.log("speed factor is " + speedFactor);
  }
}
