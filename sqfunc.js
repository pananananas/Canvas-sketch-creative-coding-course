const canvasSketch = require('canvas-sketch');
const Tweakpane    = require('tweakpane');
// const functionPlot = require('function-plot');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
};

const params = {
  a: 0.25,
  b: 1,
  c: 1,


}


const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // context.save();
    // Plot square function
    
    
    context.beginPath();
    context.moveTo(0, height/2);
    for (let x = 0; x < width; x = x + 0.01) {
      const y = height/2 - params.a * x * x - params.b * x - params.c;
      // console.log(y);
      context.lineTo(x + width/2, y);
    } 
    context.stroke();




    // context.restore();

  };
};
// Update points of function
const update = () => {

  
};



const createPane = () => {    // Control panel settings

  const pane = new Tweakpane.Pane();
  let folder = pane.addFolder({title:'Grid'});
  folder.addInput(params, 'a', { min: -10, max: 10, step: .25 });
  folder.addInput(params, 'b', { min: -10, max: 10, step: .25 });
  folder.addInput(params, 'c', { min: -10, max: 10, step: .25 });

}
createPane();
canvasSketch(sketch, settings);
