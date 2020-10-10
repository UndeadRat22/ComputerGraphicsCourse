//global variables
let canvas, context;

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
}

//transform:
/*
  sx * cos,
  sy * sin,
  sx * -sin,
  sy * cos,
  x_offset,
  y_offset
*/

const drawRecursive = (layer, color) => {
    //reached recursive depth
    if (layer == 0) {
        context.fillStyle = color;
        drawBaseShape();
        return;
    }
    //bottom right
    context.save();
    //ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    //ctx.scale(0.5, 0.5);
    context.transform(0.5, 0, 0, 0.5, canvas.width * 0.5, canvas.height * 0.5);
    drawRecursive(layer - 1, color || 'red');
    context.restore();
    
    //bottom left
    context.save();
    //ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    //ctx.rotate(Math.PI * 0.5);
    //ctx.scale(0.5, 0.5);
    context.transform(0, 0.5, -0.5, 0, canvas.width * 0.5, canvas.height * 0.5);
    
    drawRecursive(layer - 1, color || 'green');
    context.restore();

    //top left
    context.save();
    //ctx.translate(0, 0);
    //ctx.rotate(Math.PI * 1.5);
    //ctx.scale(-0.5, 0.5);
    context.transform(0, 0.5, 0.5, 0, 0, 0);
    drawRecursive(layer - 1, color || 'blue');
    context.restore();

    //top right
    context.save();
    //ctx.translate(canvas.width * 0.75, canvas.height * 0.25);
    //ctx.rotate(Math.PI * 0.5);
    //ctx.scale(-0.25, 0.25);
    context.transform(0, -0.25, -0.25, 0, canvas.width * 0.75, canvas.height * 0.25);
    drawRecursive(layer - 1, color || 'brown');
    context.restore();
}


const clear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const draw = (levels) => {
    clear();
    drawRecursive(levels);
}


window.onload = () => {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    
    const levelSlider = document.getElementById('levelSlider');
    levelSlider.onchange = function () {
        let levels = this.value;
        document.getElementById('levelValue').textContent = levels;
        draw(levels);
    }
    draw(5);
}