let capybara;


function setup(){
    let canvas = createCanvas(400,400,WEBGL);
    angleMode(DEGREES);
    
    capybara = createCapybara();
}

function draw(){
    background(196, 226, 255);
    
    orbitControl();
    lights();
    noStroke();
    scale(1.2);
    
    
    rotateY(frameCount * 1);
    translate(0,30,-70);
    model(capybara);

}

function createCapybara(){
    beginGeometry();
    
    push();
    fill(227, 165, 91);
    //body
    translate(0,0,60);
    ellipsoid(70,75,90);
    //head
    translate(0,-80,60);
    ellipsoid(40,50,60);
    //legs
    //front left
    translate(-30,140,-20);
    ellipsoid(20,40);
    //front right
    translate(60,0,0);
    ellipsoid(20,40);
    //back right
    translate(0,-0,-70);
    ellipsoid(20,40);
    //back left
    translate(-60,0,0);
    ellipsoid(20,40);
    //ears
    translate(10,-180,60);
    ellipsoid(13,18,-12);
    translate(40,0,0);
    ellipsoid(13,18,-12);
    //face
    translate(17,30,40);
    rotateX(90);
    fill(0);
    ellipsoid(4,10);
    translate(-75,0,0);
    rotateX(0);
    fill(0);
    ellipsoid(4,10);
    //snout
    translate(38,20,-15);
    rotateX(90);
    fill(148, 103, 49);
    ellipsoid(27,27,35);
    //mouth
    translate(-5,0,-32);
    rotateZ(-45);
    fill(0);
    ellipsoid(5,2,3);
    translate(6,6,-0.5);
    rotateZ(90);
    fill(0);
    push();
    ellipsoid(5,2,3);
    translate(-10,-4,1);
    rotateZ(135);
    rotateX(25);
    fill(0);
    ellipsoid(2,8,3);
    pop();
    
    //orange
    translate(40,45,70);
    rotateZ(45);
    fill(255, 139, 31);
    ellipsoid(13,15,15);
    //leaf
    translate(10,0,0);
    fill(49, 140, 13);
    rotateY(90);
    torus(5, 5 , 5,5);
    pop();

    
    
    
    let shape = endGeometry();
    return shape;
    
}