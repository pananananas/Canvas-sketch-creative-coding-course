// Letters inside of letters

// const _exports = require('@ffmpeg-installer/ffmpeg');
const canvasSketch = require('canvas-sketch');
const math   = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

let manager;

let text = 'xD';
let fontSize = 400;
let fontStyle = 'serif';


const typeCanvas  = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');


const sketch = ({ context, width, height }) => {

  const cell = 20;
  const cols = Math.floor(width  / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width  = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 0.7;

    typeContext.fillStyle = 'white';

    // typeContext.font = fontSize + 'px ' + fontStyle;     // to samo co niżej
    typeContext.font = `${fontSize}px ${fontStyle}`;
    typeContext.textBaseline = 'top';

    
    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft    * -1;
    const my = metrics.actualBoundingBoxAscent  * -1;
    const mw = metrics.actualBoundingBoxRight   + metrics.actualBoundingBoxLeft;
    const mh = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent;

    const tx = (cols - mw) / 2 - mx;
    const ty = (rows - mh) / 2 - my;


    typeContext.save();
    typeContext.translate(tx, ty);
    typeContext.beginPath();
    // typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();
    typeContext.fillText(text, 0, 0);
    typeContext.restore();


    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    // console.log(typeData);
    context.drawImage(typeCanvas, 0, 0);


    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);


    context.textBaseline = 'middle';
    context.textAlign = 'center';




    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);   // Dodaje 1 po przejściu przez wszystkie kolumny, czyli sprawia, że poruszamy się w jednej pętli tak jakbyśmy poruszalni się po podwójnej
      const x = col * cell;
      const y = row * cell;
      
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];
      
      const glyph = getGlyph(r);

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      context.fillStyle = 'white';
      
      context.save();
      context.translate(x + cell * 0.5, y + cell * 0.5);
      // context.fillRect(0, 0, cell, cell);
      
      context.font = `${cell * 1}px ${fontStyle}`;
      if (Math.random() < 0.1 ) context.font = `${cell * 3}px ${fontStyle}`;
      context.fillText(glyph, 0, 0);
      context.restore();
    }
    
  };
};


const getGlyph = (v) => {
  if (v < 50)   return ' ';
  if (v < 100)  return '.';
  if (v < 150)  return '-';
  if (v < 200)  return '+';
  const glyphs = 'xD'.split('');

  return random.pick(glyphs);
}

const onKeyUp = (e) => {
  // console.log(e);
  text = e.key.toUpperCase();
  manager.render();
}
// document.addEventListener('keyup',onKeyUp);

const start = async () => {
   manager = await canvasSketch(sketch, settings);

}
start();

// Forcing asyncronic function to run synchronously
//
// const url = 'https://picsum.photos/200';

// const loadMeSomeImage = (url) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     // img.src = url;
//     img.onload = () => resolve(img);
//     img.onerror = () => reject();
//     img.src = url;
//   });
// }

// const start1 =() => {                // "this line" will run first
//   loadMeSomeImage(url).then(img => {
//       console.log("image wudth", img.width);
//     });
//     console.log("this line");
// }

// const start2 = async () => {         // "this line" will run second
//   const img = await loadMeSomeImage(url).then(img => {
//       console.log("image wudth", img.width);
//     });
//     console.log("this line");
// }


// start1();