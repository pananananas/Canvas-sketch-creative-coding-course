// Graph visualization

const canvasSketch  = require('canvas-sketch');
const math          = require('canvas-sketch-util/math');
const random        = require('canvas-sketch-util/random');
const Tweakpane     = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1480 ],
  animate: true
};
// // Animate without canvas sketch
// const animate = () => {

//   console.log('essa');
//   requestAnimationFrame(animate);

// }
// animate();

const params = {
  count: 125,
  length: 250,
  radMin: 4,
  radMax: 10,
  velMax: 0.7,
  bounce: true,
  // frame: 0,
  // lineCap: 'round',
  // speed: 1,
  gradient1:  '#2b928d',
  gradient2:  '#b26d6d',
  line:       '#000000',
  fill:       '#000000'
}

const sketch = ({ context, width, height }) => {

  const agents = [];
  const bounce = true;

  for (let i = 0; i < params.count; i++) {
    const x = random.range(11, width  - 11);
    const y = random.range(11, height - 11);
    agents.push(new Agent(x,y));
  }

  return ({ context, width, height }) => {

    const fill = context.createLinearGradient(0, 0, width, height);   // Create gradient
    fill.addColorStop(0, params.gradient1);
    fill.addColorStop(1, params.gradient2);
    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);
    context.fillStyle = params.fill;

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      
      for (let j = i + 1; j < agents.length; j++) {

        const other = agents[j];
        const dist = agent.pos.getDistance(other.pos);

        if (dist > params.length) continue;        
        context.lineWidth =  math.mapRange(dist, 0, 200, 3, 1);
        context.strokeStyle = params.line;
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      if (params.bounce)   agent.bounce(width, height);
      else          agent.wrap(width, height);
    });

  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x,y) {
    this.pos = new Vector(x,y);
    this.vel = new Vector(random.range(-params.velMax,params.velMax),random.range(-params.velMax,params.velMax));
    this.radius = random.range(params.radMin, params.radMax);
  }
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
  draw(context) {    
    context.save();
    
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke(); 
    context.restore();
  }
  bounce(width, height) {
    if (this.pos.x - this.radius*1.3 <= 0 || this.pos.x + this.radius*1.3 >= width)  this.vel.x *= -1;
    if (this.pos.y - this.radius*1.3 <= 0 || this.pos.y + this.radius*1.3 >= height) this.vel.y *= -1;
  }
  wrap(width, height) {
    if (this.pos.x + this.radius*1.3 >= width)  this.pos.x = 0;
    if (this.pos.x - this.radius*1.3 <= 0)      this.pos.x = width;
    if (this.pos.y + this.radius*1.3 >= height) this.pos.y = 0;
    if (this.pos.y - this.radius*1.3 <= 0)      this.pos.y = height;
  }
}

const createPane = () => {    // Control panel settings

  const pane = new Tweakpane.Pane();
  let folder = pane.addFolder({title:'Parametrs'});
  folder.addInput(params, 'count',  { min: 0, max: 300,  step: 1 });
  folder.addInput(params, 'length', { min: 0, max: 1000, step: 1 });
  folder.addInput(params, 'radMin', { min: 0, max: 20,   step: 1 });
  folder.addInput(params, 'radMax', { min: 0, max: 20,   step: 1 });
  folder.addInput(params, 'velMax', { min: 0, max: 4,    step: 0.1 });
  folder.addInput(params, 'bounce');

  folder = pane.addFolder({title:'Color'})
  folder.addInput(params, 'gradient1',  { picker: 'inline', expanded: true, });
  folder.addInput(params, 'gradient2',  { picker: 'inline', expanded: true, });
  folder.addInput(params, 'line',       { picker: 'inline', expanded: true, });
  folder.addInput(params, 'fill',       { picker: 'inline', expanded: true, });
}
createPane();