// Rectangles in a grid

const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width*0.005;
    context.strokeStyle = 'pink';

    const W   = width*0.1;
    const H   = height*0.1;
    const gap = width*0.03;
    const ix  = width*0.17;
    const iy  = height*0.17;

    const off = width *0.02;

    let x, y;

    for(let i = 0; i < 5; i++) {
      for(let j = 0; j < 5; j++) {

        x = ix + (W + gap) * i;
        y = iy + (H + gap) * j;

        context.beginPath();
        context.rect(x,y,W,H);
        context.stroke();
        if (Math.random() > 0.5) {
            context.beginPath();
            context.rect(x+off/2,y+off/2,W-off,H-off);
            context.stroke();                    
        }
      }
    }

  };
};

canvasSketch(sketch, settings);



// const canvasSketch = require('canvas-sketch');

// // Sketch parameters
// const settings = {
//   dimensions: 'a4',
//   pixelsPerInch: 300,
//   units: 'in'
// };

// // Artwork function
// const sketch = () => {
//   return ({ context, width, height }) => {
//     // Margin in inches
//     const margin = 1 / 4;

//     // Off-white background
//     context.fillStyle = 'hsl(0, 0%, 98%)';
//     context.fillRect(0, 0, width, height);

//     // Gradient foreground
//     const fill = context.createLinearGradient(0, 0, width, height);
//     fill.addColorStop(0, 'cyan');
//     fill.addColorStop(1, 'orange');

//     // Fill rectangle
//     context.fillStyle = fill;
//     context.fillRect(margin, margin, width - margin * 2, height - margin * 2);
//   };
// };

// // Start the sketch
// canvasSketch(sketch, settings);