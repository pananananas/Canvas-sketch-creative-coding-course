// Curves: animation of moving multiple curves with color schemes controlled by noise

const canvasSketch = require('canvas-sketch');
const math         = require('canvas-sketch-util/math');
const random       = require('canvas-sketch-util/random');
const colormap     = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
	animate: true,
};

const sketch = ({ width, height }) => {

  const cols = 90;
  const rows = 5;
  const numCells = cols * rows;
  const speed = 3;
  
  const gw = width  * 0.8;      // Grid
  const gh = height * 0.8;
  const cw = gw / cols;         // Cell
  const ch = gh / rows;
  const mx = (width  - gw) / 2; // Margins
  const my = (height - gh) / 2;

  const points = [];
  
  let x, y, n, lineWidth, color;
  let freq = 0.002;
  let amp = 90;

  let colors = colormap({
    colormap: 'cdom',
    nshades: amp,
  });

  for (let i = 0; i < numCells; i++) {
    x = ( i % cols ) * cw;
    y = Math.floor(i / cols) * ch;

    n         = random.noise2D(x, y, freq, amp);
    lineWidth = math.mapRange(n, -amp, amp, 1, 6);
    color     = colors[Math.floor(math.mapRange(n, -amp, amp, 0, amp))];

    points.push( new Point( { x, y, lineWidth, color } ) );
  }

  return ({ context, width, height, frame }) => {

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);

    points.forEach(point => {
			n = random.noise2D(point.ix + frame * speed, point.iy, freq, amp);
			point.x = point.ix + n;
			point.y = point.iy + n;
		});

    let lastX, lastY;
   
    for (let r = 0; r < rows; r++) {  // Draw Lines
      
      for (let c = 0; c < cols - 1; c++) {

        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];

        const mx = curr.x + (next.x - curr.x) * 0.9;
        const my = curr.y + (next.y - curr.y) * 7;

        if (!c) {
          lastX = curr.x;
          lastY = curr.y;
        }
        context.beginPath();

        context.lineWidth   = curr.lineWidth;
        context.strokeStyle = curr.color;

        context.moveTo(lastX, lastY);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);

        context.stroke();

        lastX = mx - c / cols * 250;
        lastY = my - r / cols * 250;
      }
    }
    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({x, y, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;
    this.ix = x;
    this.iy = y;
  }
}