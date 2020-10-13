//global variables
let canvas, context;

//context.transform(0.5, 0, 0, 0.5, canvas.width * 0.5, canvas.height * 0.5);
//context.transform(0, 0.5, -0.5, 0, canvas.width * 0.5, canvas.height * 0.5);
//context.transform(0, 0.5, 0.5, 0, 0, 0);
//context.transform(0, -0.25, -0.25, 0, canvas.width * 0.75, canvas.height * 0.25);

const transformations = {
  br: {
    rotation: 0,
    scale: { x: 0.5, y: 0.5 },
    offset: { x: 0.5, y: 0.5 },
  },
  bl: {
    rotation: Math.PI * 0.5,
    scale: { x: 0.5, y: 0.5 },
    offset: { x: 0.5, y: 0.5 },
  },
  tl: {
    rotation: Math.PI * 1.5,
    scale: { x: -0.5, y: 0.5 },
    offset: { x: 0, y: 0 },
  },
  tr: {
    rotation: Math.PI * 0.5,
    scale: { x: -0.25, y: 0.25 },
    offset: { x: 0.75, y: 0.25 },
  },
};

const colors = {
  br: 'red',
  bl: 'green',
  tl: 'blue',
  tr: 'brown',
};

/*
-
- -
*/
const drawBaseShape = () => {
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width * 0.3, 0);
  context.lineTo(canvas.width * 0.3, canvas.height * 0.5);
  context.lineTo(canvas.width, canvas.height * 0.5);
  context.lineTo(canvas.width, canvas.height);
  context.lineTo(0, canvas.height);
  context.closePath();
  context.fill();
};

const clear = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const updateFrame = (selected, lerp) => {
  clear();
  context.save();
  context.fillStyle = colors[selected];
  const transformation = transformations[selected];
  context.translate(
    lerp * transformation.offset.x * canvas.width,
    lerp * transformation.offset.y * canvas.height
  );
  context.rotate(lerp * transformation.rotation);
  context.scale(
    1 - lerp + lerp * transformation.scale.x,
    1 - lerp + lerp * transformation.scale.y
  );
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
  updateFrame(selectedTransformation, lerp);
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
