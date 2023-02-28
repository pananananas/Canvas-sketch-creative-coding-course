// Partacles

const canvasSketch = require('canvas-sketch');
const math         = require('canvas-sketch-util/math');
const random       = require('canvas-sketch-util/random');
const colormap     = require('colormap');
const eases        = require('eases');
const interpolate  = require('color-interpolate');

const settings = {
  dimensions: [ 1080, 1080 ],
	animate: true,
};

const particles = [];
const numParticles = 200;
const cursor = { x:9999, y:9999 };

const colors = colormap({
  colormap: 'viridis',
  nshades: 20,
});

let elCanvas;
let imgA, imgB;


const sketch = ({ canvas, width, height }) => {
  let x, y, particle, radius;

  const imgACanvas  = document.createElement('canvas');
  const imgAContext = imgACanvas.getContext('2d');
  imgACanvas.width  = imgA.width;
  imgACanvas.height = imgA.height;
  imgAContext.drawImage(imgA, 0, 0);

  const imgAData = imgAContext.getImageData(0, 0, imgA.width, imgA.height).data;


  const imgBCanvas  = document.createElement('canvas');
  const imgBContext = imgBCanvas.getContext('2d');
  imgACanvas.width  = imgB.width;
  imgACanvas.height = imgB.height;
  imgAContext.drawImage(imgB, 0, 0);

  const imgBData = imgAContext.getImageData(0, 0, imgA.width, imgA.height).data;


  const numCircles = 25;
  const gapCircle  = 3;
  const gapDot     = 3;
  let   dotRadius  = 12;
  let   cirRadius  = 0;
  const fitRadius  = dotRadius;

  elCanvas = canvas
  canvas.addEventListener('mousedown', onMouseDown );

  for (let i = 0; i < numCircles; i++) {
    const circumference = Math.PI * 2 * cirRadius;
    const numFit = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1;
    const fitSlice = Math.PI * 2 / numFit;
    let ix, iy, idx, r, g, b,a , colA, colB, colMap;


    for (let j = 0; j < numFit; j++) {
      
      const theta = j * fitSlice;
      x = cirRadius * Math.cos(theta);
      y = cirRadius * Math.sin(theta);
      
      x += width  / 2;
      y += height / 2;
      
      ix = Math.floor((x / width)  * imgA.width);     // ImgA 
      iy = Math.floor((y / height) * imgA.height);

      idx = (iy * imgA.width + ix) * 4;         
      
      r = imgAData[idx + 0];
      g = imgAData[idx + 1];  
      b = imgAData[idx + 2];
      // a = imgAData[idx + 3];
      colA = `rgb(${r}, ${g}, ${b})`;


      ix = Math.floor((x / width)  * imgA.width);     // ImgB
      iy = Math.floor((y / height) * imgA.height);

      idx = (iy * imgA.width + ix) * 4;
      
      r = imgBData[idx + 0];
      g = imgBData[idx + 1];  
      b = imgBData[idx + 2];
      // a = imgAData[idx + 3];
      colB = `rgb(${r}, ${g}, ${b})`;


      colMap = interpolate([colA, colB]);

      // radius = dotRadius;

      radius = math.mapRange(r,0,255,1,12)

      particle = new Particle({ x, y, radius, colMap });
      particles.push(particle);

    }
    cirRadius += fitRadius * 2 + gapCircle;
    dotRadius = (1 - eases.quadOut(i/numCircles)) * fitRadius;
  }


  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    // context.drawImage(imgA, 0, 0);
    

    particles.sort((a, b) => a.scale - b.scale);


    particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });
    
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup',   onMouseUp);

  onMouseMove(e);
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth)  * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor.x = x;
  cursor.y = y;
  console.log('cursor', cursor);
};

const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup',   onMouseUp);
  cursor.x = 9999;
  cursor.y = 9999;
  console.log('cursor', cursor);
};

const loadImage = async (url) => {
  return new Promise((resolve, reject) => { 
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {

  imgA = await loadImage('input/pics/portrait03.png');
  imgB = await loadImage('input/pics/background01.png');

  canvasSketch(sketch, settings);
};

start();

class Particle {
  constructor( { x, y, radius = 40, colMap } ) {
    this.x  = x;  // Position
    this.y  = y;
    this.ax = 0;  // Acceleration
    this.ay = 0;
    this.vx = 0;  // Velocity
    this.vy = 0;
    this.ix = x;  // Initial position
    this.iy = y;

    this.minDist    = random.range(180, 220);
    this.pushFactor = random.range(0.01, 0.02);
    this.pullFactor = random.range(0.005, 0.01);
    this.dampFactor = random.range(0.92, 0.94);

    this.scale  = 1;
    this.radius = radius;
    // this.color = colors[0];
    this.colMap = colMap;
    this.color = colMap(0);
  }

  update() {
    let dx, dy,dd,distDelta;
    let iColor;

    dx = this.ix - this.x;    // Pull force
    dy = this.iy - this.y;
    dd = Math.sqrt(dx * dx + dy * dy);
    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    this.scale = math.mapRange(dd, 0, 200, 1, 5);

    // iColor = Math.floor(math.mapRange(dd, 0, 200, 0, colors.length - 1, true));
    // this.color = colors[iColor];

    this.color = this.colMap(math.mapRange(dd, 0, 200, 0, 1, true));

    dx = this.x - cursor.x;   // Push force
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);
    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    } 

    this.vx += this.ax;
    this.vy += this.ay;

		this.vx *= this.dampFactor;
		this.vy *= this.dampFactor;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}