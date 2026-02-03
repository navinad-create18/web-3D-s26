let dino;


function setup(){
    let canvas = createCanvas(400,400,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
    dino = createDino();
}

function draw(){
    background(240, 188, 120);
    
    orbitControl();
    lights();
    noStroke();
    
    
    model(dino);

}

function createDino(){
    beginGeometry();
    
    push();
    fill(0,20,170);
    cylinder(100,30,30);
    
    pop();

    
    
    
    let shape = endGeometry();
    return shape;
    
}