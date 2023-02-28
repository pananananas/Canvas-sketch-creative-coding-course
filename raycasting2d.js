const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};


let b;

const sketch = () => {
  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    b = new Boundry({ x1: 200, y1: 100, x2: 300, y2: 300 });
    b.show();
  
  
  
  };
};



class Boundry {
  constructor({ x1, y1, x2, y2 }) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2); 

    // this.x1 = x1;
    // this.y1 = y1;
    // this.x2 = x2;
    // this.y2 = y2;
  }
  show() {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}



canvasSketch(sketch, settings);
