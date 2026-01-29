function setup(){
    let canvas = createCanvas(400,400,WEBGL);
    angleMode(DEGREES);
    
}

function draw(){
    background(0);
    orbitControl();
    stroke(255);
    fill(255,0,0);
    box(100);
    // change origin point to 100 pixels closer
    translate(0,0,100);
    fill(0,255,0);
    box(50);
    translate(0,0,50);
    rotateY(45);
    rotateX(45);
    fill(0,0,255);
    box(25);
    translate(100,0,0);
    scale(0.5);
    fill(0);
    box(25);
}