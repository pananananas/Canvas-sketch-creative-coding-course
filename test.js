const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const MAX_ITERATIONS = 100;
const SIZE = 1200

const settings = {
  dimensions: [ SIZE, SIZE ],
  // animate: true, // TODO: animate something
};

// To move to Tweakpane
// TODO: scale can respond to mouse scroll
const params = {
  shift: 0,
  scaleMin: -2,
  scaleMax: 2,
}

// TODO: class system for other fractals
function fractal(i, j) {
  let iterations = 0;
  let z = new Complex(0.0, 0.0);
  const c = new Complex(
    math.mapRange(i, 0, SIZE, params.scaleMin, params.scaleMax),
    math.mapRange(j, 0, SIZE, params.scaleMin, params.scaleMax),
  );

  while (iterations < MAX_ITERATIONS) {
    // The 4.0 here can be a param
    if (Math.pow(z.x, 2.0) + Math.pow(z.y, 2.0) > 4.0)
      break ;

      // Mandelbrot
    z = c.add(z.squared());
    iterations++;
  }
  return (iterations);
}

// Color
function generateRgb(ratio, power, n)
{
  return (n * Math.pow((1 - ratio), power) * Math.pow(ratio, (4 - power)) * 255);
}

function getColor(iterations) {
  if (iterations == MAX_ITERATIONS) {
    return (`rgb(0, 0, 0)`);
  }

  const rgb = [];
  const ratio = Math.sqrt(iterations / MAX_ITERATIONS);

  rgb[(0 + params.shift) % 3] = generateRgb(ratio, 2, 15);
  rgb[(1 + params.shift) % 3] = generateRgb(ratio, 1, 9);
  rgb[(2 + params.shift) % 3] = generateRgb(ratio, 3, 8.5);

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

const sketch = () => {
  const cell = 1;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Main loop
    // i : width : x
    // j : height : y
    // TODO: use one loop (instead of nested) from exercises
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // called fractal to allow using others (Julia, Burning Ship)
        const iterations = fractal(i, j);

        context.fillStyle = getColor(iterations);

        context.save();
        context.translate(i, j);
        context.translate(cell * 0.5, cell * 0.5);

        context.fillRect(0, 0, cell, cell);

        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);

// TODO: refactor Vector seems useless
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }
}

// Implemented after color functions
class Complex extends Vector {
  squared() {
    const x = (this.x * this.x) - (this.y * this.y);
    const y = 2.0 * this.x * this.y;
    return new Complex(x, y);
  }

  // Error with super missing here because return of parent .add() was a Vector
  // with undefined .squared()
  add(c) {
    const v = super.add(c);
    return new Complex(v.x, v.y);
  }
}