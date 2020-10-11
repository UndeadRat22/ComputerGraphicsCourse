//global variables
let canvas, context;

//context.transform(0.5, 0, 0, 0.5, canvas.width * 0.5, canvas.height * 0.5);
//context.transform(0, 0.5, -0.5, 0, canvas.width * 0.5, canvas.height * 0.5);
//context.transform(0, 0.5, 0.5, 0, 0, 0);
//context.transform(0, -0.25, -0.25, 0, canvas.width * 0.75, canvas.height * 0.25);

const transformations = {
  br: [0.5, 0, 0, 0.5, 0.5, 0.5],
  bl: [0, 0.5, -0.5, 0, 0.5, 0.5],
  tl: [0, 0.5, 0.5, 0, 0, 0],
  tr: [0, -0.25, -0.25, 0, 0.75, 0.25],
};

/*
-
- -
*/
const drawBaseShape = () => {
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width * 0.5, 0);
  context.lineTo(canvas.width * 0.5, canvas.height * 0.5);
  context.lineTo(canvas.width, canvas.height * 0.5);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();
};

const clear = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const updateFrame = (transformation, lerp) => {
  const lerpedTransformation = [
    (1 - lerp) * 1 + lerp * transformation[0],
    (1 - lerp) * 0 + lerp * transformation[1],
    (1 - lerp) * 0 + lerp * transformation[2],
    (1 - lerp) * 1 + lerp * transformation[3],
    (1 - lerp) * 0 + lerp * transformation[4] * canvas.width,
    (1 - lerp) * 0 + lerp * transformation[5] * canvas.height,
  ];
  clear();
  context.save();
  context.transform(...lerpedTransformation);
  drawBaseShape();
  context.restore();
};

let startTime = undefined;
const animationDuration = 1000;
let selectedTransformation = 'br';

const timeStep = (time) => {
  if (startTime === undefined) {
    startTime = time;
  }
  const elapsed = time - startTime;
  lerp = Math.min(elapsed / animationDuration, 1); //clamp to 1
  updateFrame(transformations[selectedTransformation], lerp);
  window.requestAnimationFrame(timeStep);
};

window.onload = () => {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  const transformationSelect = document.getElementById('transformations');
  transformationSelect.onchange = function () {
    startTime = undefined;
    selectedTransformation = this.value;
  };
  window.requestAnimationFrame(timeStep);
};
