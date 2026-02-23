let oven;
let ovenColor;


function preload(){
    oven = loadModel("assets/oven_body3.obj", true);
    ovenColor = loadImage("assets/oven_body3Color.png");
    
}

function setup(){
    let canvas = createCanvas(800,600,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
}


function draw(){
    background(231, 186, 255);
    orbitControl();
    
    lights();
    createOven();
}

function createOven(){
    //oven
    push();
    translate(0,0,0);
    scale(2);
    noStroke();
    rotateX(180);
    rotateY(90);
    texture(ovenColor); 
    model(oven);
    pop();
}

