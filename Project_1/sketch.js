let oven;



function setup(){
    let canvas = createCanvas(800,600,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
    oven = createOven();
}

function draw(){
    background(194, 155, 250);
    
    
    orbitControl();
    lights();
    
        
    noStroke();
    
    push();
    translate(0,0,0);
    emissiveMaterial(30,40,40);
    specularMaterial(13, 190, 255);
    shininess(100);
    model(oven);
    pop();
    

}

function createOven(){
    beginGeometry();
    
    //main body
    push();
    box(400,400,400);
    pop();
    
    
    
    let shape = endGeometry();
    return shape;
    
}