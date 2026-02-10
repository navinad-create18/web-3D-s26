let pear;
let pearColor;

function preload(){
    pear = loadModel("assets/Pear_Model1.obj", true);
    pearColor = loadImage("assets/pear_color.png");
}

function setup(){
    let canvas = createCanvas(500,500,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
}

function draw(){
    background(194, 155, 250);
    
    orbitControl();
    lights();
    
    noStroke();
    ambientMaterial(179, 126, 12);
    rotateX(180);
    model(pear);
    texture(pearColor);
}


