// Triangle filled with random color rectangles

const canvasSketch = require('canvas-sketch');
const math         = require('canvas-sketch-util/math');
const random       = require('canvas-sketch-util/random');
const color        = require('canvas-sketch-util/color');
const Tweakpane    = require('tweakpane');
const risoColors   = require('riso-colors');

const seed = Date.now();
// const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
	// animate: true,
	name:seed,
};

const sketch = ({ context, width, height }) => {
	random.setSeed(seed);

  let x, y, w, h, fill, stroke, blend;
  
	const num = 40;
	const degrees = random.range(0,180);
	const rects = [];

	const rectColors = [
		random.pick(risoColors),
		random.pick(risoColors),
		random.pick(risoColors)
	];
	const bgColor = random.pick(rectColors).hex;

	const mask = {	
		radius: width * 0.4,
		sides: 3,
		x: width  * 0.5,
		y: height * 0.57,			// 0.57 for triangle
	}

  for (let i = 0; i < num; i++) {		// Values for rects
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(600, width);
    h = random.range(40,  200);
		
		fill   = random.pick(rectColors).hex;
		stroke = random.pick(rectColors).hex;
		blend = (random.value() > 0.8) ? 'overlay' : 'source-over';

    rects.push({ x, y, w, h, fill, stroke, blend });
  }


  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

		context.save();						// Draw Polygon
		context.translate(mask.x, mask.y );

		drawPolygon({ context, radius: mask.radius, sides: mask.sides});

		context.clip();


    rects.forEach(rect => {		// Draw rectangles
			const { x, y, w, h, fill, stroke } = rect;
      let shadowColor;

      context.save();
			context.translate(-mask.x, -mask.y);
      context.translate(x, y);
			context.strokeStyle = stroke;
			context.fillStyle = fill;
			context.lineWidth = 7;

			context.globalCompositeOperation = blend;

			drawWeirdRect({ context, w, h, degrees });
		
			shadowColor = color.offsetHSL(fill, 0, 0, -20);
			shadowColor.rgba[3] = 0.5;
			context.shadowColor = color.style(shadowColor.rgba);
			// context.shadowBlur = 5;
			context.shadowOffsetX = -10;
			context.shadowOffsetY = 20;
			context.fill();
			context.shadowColor = null;
			context.stroke();
			
			// Create black outline of rects
			//
			// context.globalCompositeOperation = 'source-over';
			// context.lineWidth = 2;
			// context.strokeStyle = 'black';
			// context.stroke();
			context.restore();
    });

		context.restore();
		
		context.save();						// Draw Polygon outline
		context.translate(mask.x, mask.y);
		context.lineWidth = 20;

		drawPolygon({ context, radius: mask.radius-context.lineWidth, sides: mask.sides });
		
		context.globalCompositeOperation = 'color-burn';
		context.strokeStyle = rectColors[1].hex;
		context.stroke();
		context.restore();
  };
};

const drawWeirdRect = ({context, w, h, degrees}) => {

  const angle = math.degToRad(-degrees);
  const rx 	  = Math.cos(angle) * w;
  const ry 		= Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0,  0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0,  h);
  context.closePath();
  // context.stroke();
  context.restore();
}

const drawPolygon = ({ context, radius, sides }) => {

	const slice = Math.PI * 2 / sides;
	context.beginPath();
	context.moveTo(0, -radius);

	for (let i = 0; i < sides; i++) {
		const theta = i * slice - Math.PI / 2;
		context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
	}
	context.closePath();
};

canvasSketch(sketch, settings);