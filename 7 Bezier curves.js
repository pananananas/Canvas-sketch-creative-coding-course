// Curves intro: mouse interaction and drawing curves

const canvasSketch = require('canvas-sketch');
const math         = require('canvas-sketch-util/math');
const random       = require('canvas-sketch-util/random');
const color        = require('canvas-sketch-util/color');
const Tweakpane    = require('tweakpane');
const risoColors   = require('riso-colors');


const settings = {
  dimensions: [ 1080, 1080 ],
	animate: true
};

let elCanvas;
let points;

const sketch = ({ canvas }) => {
  points = [
    new Point({ x: 200, y: 500 }),
    new Point({ x: 200, y: 200 }),
    new Point({ x: 800, y: 200 }),
    new Point({ x: 800, y: 800 }),
    new Point({ x: 200, y: 800 }),
    new Point({ x: 200, y: 500 }),
  ];

  canvas.addEventListener('mousedown', onMouseDown );
  elCanvas = canvas;


  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#999'; // grey

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++)    // Drawing helping lines
      context.lineTo(points[i].x, points[i].y);
    
    context.stroke();

    context.beginPath();

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[(i + 1) % points.length];
      
      const mx = curr.x + (next.x - curr.x) / 2;
      const my = curr.y + (next.y - curr.y) / 2;
                                    // Drawing curves
      if ( i == 0 )                    context.moveTo(curr.x, curr.y);
      else if (i == points.length - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      else                             context.quadraticCurveTo(curr.x, curr.y, mx, my);
    }
    context.lineWidth = 4;
    context.fillStyle = 'blue';
    context.stroke();

    points.forEach(point => { point.draw(context); });    // Drawing points
  };
};

onMouseDown = (e) => {

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup',   onMouseUp);

  const x = (e.offsetX / elCanvas.offsetWidth)  * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  let hit = false;

  points.forEach(point => {
    point.isDragging = point.hitTest(x, y);
    if ( !hit && point.isDragging )   hit = true;
  });

  if ( !hit ) {
    points.push(new Point({ x, y }));
  }
};

onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth)  * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  points.forEach(point => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
};
onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup',   onMouseUp);
};
canvasSketch(sketch, settings);


class Point {
  constructor({x, y, control = false}) {
    this.x = x;
    this.y = y;
    this.control = control;
  }
  draw(context) {
    context.save();

    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0, 0, 7, 0, Math.PI * 2);

    context.fillStyle = this.control ? 'red' : 'black';  
    context.fill();

    context.restore();
  }
  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy) < 20;
  }
}