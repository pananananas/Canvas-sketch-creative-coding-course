// Animating flowy lines

const canvasSketch = require('canvas-sketch');
const math         = require('canvas-sketch-util/math');
const random       = require('canvas-sketch-util/random');
const Tweakpane    = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
  cols: 30,
  rows: 30,
  scaleMin: 0.5,
  scaleMax: 15,
  length: 0.8,
  freq: 0.0014,
  amp:  0.25,
  animate: true,
  frame: 0,
  lineCap: 'round',
  speed: 1.6,
  gradient1:  '#2b928d',
  gradient2:  '#b26d6d',
  line:       '#000000'
}

const sketch = () => {
  return ({ context, width, height, frame }) => {

    const fill = context.createLinearGradient(0, 0, width, height);   // Create gradient
    fill.addColorStop(0, params.gradient1);
    fill.addColorStop(1, params.gradient2);
    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);

    const numCells = params.cols * params.rows;
    const gridw = width  * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / params.cols;
    const cellh = gridh / params.rows;
    const margx = (width  - gridw) / 2;
    const margy = (height - gridh) / 2;

    for (let i = 0; i < numCells; i++) {

      const col = i % params.cols;
      const row = Math.floor(i / params.cols);   // Dodaje 1 po przejściu przez wszystkie kolumny
      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      // jeśli animate = true: f = frame, else: f = params.frame
      const f = params.animate ? frame: params.frame;
      const n = random.noise3D(x, y, f * 10 * params.speed, params.freq);
      const angle = n * Math.PI * params.amp;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(margx + x + w * 0.5, margy + y + h * 0.5);
      
      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      context.strokeStyle = params.line;

      context.rotate(angle);
      context.beginPath();
      context.moveTo(w * -params.length / 2, 0);
      context.lineTo(w *  params.length / 2, 0);
      context.stroke();
      context.restore();
    }
  };
};

const createPane = () => {    // Control panel settings

  const pane = new Tweakpane.Pane();
  let folder = pane.addFolder({title:'Grid'});
  folder.addInput(params, 'cols', { min: 2, max: 100, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 100, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 0, max: 40, step: 1 });
  folder.addInput(params, 'scaleMax', { min: 0, max: 40, step: 1 });
  folder.addInput(params, 'length', { min: 0, max: 3, step: 0.1 });
  folder.addInput(params, 'lineCap', { options: {butt: 'butt', round: 'round', square: 'square' }});
  
  folder = pane.addFolder({title:'Noise'})
  folder.addInput(params, 'freq', { min: -0.005, max: 0.005, step: 0.00001 });
  folder.addInput(params, 'amp',  { min: -2, max: 2, step: 0.01 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', { min: 0, max: 999, step: 1 });

  // folder = pane.addFolder({title:'Animation'})
  folder.addInput(params, 'speed', { min: 0, max: 10, step: 0.1 });

  folder = pane.addFolder({title:'Window'})
  folder.addInput(params, 'gradient1',  { picker: 'inline', expanded: true, });
  folder.addInput(params, 'gradient2',  { picker: 'inline', expanded: true, });
  folder.addInput(params, 'line',      { picker: 'inline', expanded: true, });
}
createPane();
canvasSketch(sketch, settings);