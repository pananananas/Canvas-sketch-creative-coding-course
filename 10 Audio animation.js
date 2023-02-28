// Audio:

const canvasSketch = require('canvas-sketch');
const math         = require('canvas-sketch-util/math');
const random       = require('canvas-sketch-util/random');
const colormap     = require('colormap');
const eases        = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
	animate: true,
};

const audioSource = './input/audio/03_Utwór.mp3'
let audio;
let audioContext, audioData, analyserNode, sourceNode;
let manager;
let minDb, maxDb;

const sketch = () => {
  const numCircles = 7;
  const numSlices  = 1;
  const slice = 2 * Math.PI / numSlices;
  const minRadius = 75;
  const minFreq   = 4;
  const maxFreq   = 225;

  const bins       = [];
  const lineWidths = [];
  const rotOffsets = [];

  let   lineWidth, bin, mapped, phi;

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(minFreq, maxFreq); // Freq range
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / ( numCircles - 1 );//        Line widths
    lineWidth = eases.quadIn(t) * 200 + 10;
    lineWidths.push(lineWidth);
    //                                         Rotation offsets
    rotOffsets.push(random.range(Math.PI * -0.3, Math.PI * 0.3) - Math.PI * 0.7);
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#EEEAE0';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;
    analyserNode.getFloatFrequencyData(audioData);

    let cradius = minRadius;

    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.scale(1, -1);

    for (let i = 0; i < numCircles; i++) {
      context.save();

      context.rotate(rotOffsets[i]);
      cradius += lineWidths[i] * 0.5 + 2;

      for (let j = 0; j < numSlices; j++) {

        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];
      
        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        phi = slice * mapped;

        context.beginPath();
        context.arc(0, 0, cradius, 0, phi);
        context.stroke();
      }
      cradius += lineWidths[i] * 0.5;

      context.restore();
    }
    context.restore();
  };
};

const addListeners = () => {
  window.addEventListener('mousedown', () => {
    if (!audioContext)  createAudio();

    if (audio.paused) {  
      audio.play();
      manager.play();
    } else {               
      audio.pause(); 
      manager.pause();
    }
  });
}

const createAudio = ()  => {
  audio = document.createElement('audio');
  audio.src = audioSource;

  audioContext = new AudioContext();

  sourceNode   = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);
  
  minDb = analyserNode.minDecibels;
	maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
}

const getAverage = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
}

const start = async () => {

  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
}
start();