let flamingo;
let myBubbles;
let lightX = 300;
let lightDir = false;

let bubbleColors = [
    [19, 76, 145,70],//dark blue
    [76, 149, 237,80],//medium blue
    [204, 227, 255,75]//light blue
];
// fourth value in color for transparency or alpha value


function setup(){
    let canvas = createCanvas(500,500,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
    flamingo = createFlamingo();
    myBubbles = blueBubbles();
}

function draw(){
    background(194, 155, 250);
    
    
    orbitControl();
    lights();
    pointLight(122, 220, 255,lightX,0,0);
    
    if(lightDir) {
        lightX++;
        if(lightX >= 300) {
            lightDir = false;
        }
    } else if(!lightDir) {
        lightX--;
        if(lightX <= -300) {
            lightDir = true;
        }
    }
        
    noStroke();
    
    push();
    translate(20,50,0);
    emissiveMaterial(30,40,40);
    specularMaterial(13, 190, 255);
    shininess(100);
    model(flamingo);
    pop();
    
    model(myBubbles);

}

function createFlamingo(){
    beginGeometry();
    
    //main body
    push();
    rotateX(90);
    fill(255, 59, 163);
    torus(100,50);
    pop();
    
    //neck
    push();
    fill(255, 59, 163);
    translate(-90,-20,0);
    cylinder(30,40,30);
    translate(0,-20,0);
    ellipsoid(30,50,30);
    translate(20,-40,0);
    rotateZ(35);
    ellipsoid(30,50,30);
    translate(-10,-40,0);
    rotateZ(-35);
    ellipsoid(30,50,30);
    translate(-10,-40,0);
    rotateZ(-35);
    ellipsoid(30,50,30);
    translate(-10,-40,0);
    rotateZ(-35);
    ellipsoid(30,50,30);
    translate(-10,-40,0);
    rotateZ(-35);
    ellipsoid(30,50,30);
    translate(-10,-40,0);
    rotateZ(-35);
    fill(255, 224, 191);
    ellipsoid(15,40,15);
    translate(-15,-50,0);
    rotateZ(-45);
    fill(0);
    ellipsoid(12,30,12);
    pop();
    
    //front left eye
    push();
    translate(-150,-185,15);
    fill(255);
    sphere(17,15,20);
    translate(-2,1,9);
    fill(0);
    sphere(10,10,10);
    translate(1,0,6);
    fill(255);
    sphere(5,5,5);
    pop();
    
    //back right eye
    push();
    translate(-150,-185,-15);
    fill(255);
    sphere(17,15,20);
    translate(-2,1,-9);
    fill(0);
    sphere(10,10,10);
    translate(1,0,-6);
    fill(255);
    sphere(5,5,5);
    pop();
    
    
    
    let shape = endGeometry();
    return shape;
    
}

function blueBubbles(){
    beginGeometry();
       for (let i = 0; i < 20; i++) {
           translate(-10,10,-10);
    let x = random(0,200);
    let y = random(50,130);
    let z = random(150);
    let c = random(bubbleColors);
    let s = random(0.5,1.5);
    
    push();
    noStroke();
    translate(x,y,z);
    fill(...c);
    scale(s);
    sphere(20,20,20);
    pop();
       }
    let shape = endGeometry();
    return shape;
}