let dino;
// fourth value in color for transparency or alpha value


function setup(){
    let canvas = createCanvas(500,500,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
    dino = createDino();
}

function draw(){
    background(204, 240, 217);
    
    orbitControl();
    lights();
    noStroke();
    
    
    model(dino);

}

function createDino(){
    beginGeometry();
    
    push();
    fill(10, 79, 35);
    box(150,80,150);
    translate(0,-30,60);
    ellipsoid(80,30,30);
    translate(0,60,0);
    ellipsoid(80,30,30);
    translate(0,-30,0);
    ellipsoid(80,30,30);
    pop();
    
    push();
    fill(10, 79, 35);
    translate(-70,0,70);
    ellipsoid(20,45,20);
    translate(140,0,0);
    ellipsoid(20,45,20);
    pop();

    
    
    
    let shape = endGeometry();
    return shape;
    
}