// Circles and Rectangles placed around the center of the canvas

const canvasSketch = require('canvas-sketch');
const math   = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [ 1080, 1480 ],
  // animate: true
};

const sketch = () => {

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';

    const cx = width  * 0.5;
    const cy = height * 0.5;
    const w  = width  * 0.01;
    const h  = height * 0.1;
    const circles = [];
    const rectangles = [];


    // Jest to próba zrobienia czegoś ciekawego (zobiektowania i obracania kół) :)
    // for (let i = 0; i < 30; i++) {
    //   circles.push(new Circle(cx, cy, width * 0.3 * random.range(0.8,1.2), 30));
    // }
    // for (let i = 0; i < 30; i++) {
    //   rectangles.push(new Rectangle(cx, cy, w, h, 30));
    // }


    // for (let i = 0; i < circles.length; i++) {
    //   context.lineWidth = random.range(5,15);

    //   circles[i].draw(context);
    // } 

    
    let x, y;
    const num = 30;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
      
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();
      context.translate(x,y);
      context.rotate(-angle);
      context.scale(random.range(0.1,2), random.range(0.2,0.5));

      context.beginPath();
      context.rect(random.range(0,-h/2),-h *.5,w,h);
      context.fill();
      context.restore();


      context.lineWidth = random.range(5,15);

      context.save();
      context.translate(cx,cy);
      context.rotate(-angle);

      context.beginPath();
      context.arc(0, 0, radius * random.range(0.8,1.2), slice * random.range(1,-7),slice * random.range(1,4));
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);


class Rectangle {
  constructor(x, y, w, h, num) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.num = num;
  }
  draw(context, radius) {
    const slice = math.degToRad(360 / num);
    const angle = slice * i;

    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);

    context.save();
    context.translate(this.x, this.y);
    context.rotate(-angle);
    context.scale(random.range(0.1,2), random.range(0.2,0.5));
    context.beginPath();
    context.rect(random.range(0,-h/2),-h *.5,w,h);
    context.fill();
    // context.stroke(); 
    context.restore();
  }
}
class Circle {
  constructor(x, y, rad, num) {
    this.x = x;
    this.y = y;
    this.radius = rad;
    const slice1 = math.degToRad(360 / num) * random.range(1,-7);
    const slice2 = math.degToRad(360 / num) * random.range(1,4);
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    // context.rotate(-angle);
    // context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, this.radius, slice1 , slice2);
    // context.fill();
    context.stroke(); 
    context.restore();
  }
}