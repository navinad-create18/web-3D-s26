let oven;
let ovenColor;
let coil;

let chicken;
let chickenColor;

let showCoil1 = false;
let showCoil2 = false;
let showCoil3 = false;
let showCoil4 = false;


function preload(){
    oven = loadModel("assets/oven_body3.obj", true);
    ovenColor = loadImage("assets/oven_body3Color.png");
    
    coil = loadModel("assets/oven_coil.obj", true);
    
    chicken = loadModel("assets/mc_chicken.obj", true);
    chickenColor = loadImage("assets/mc_chicken_color.png");

}

function setup(){
    let canvas = createCanvas(800,600,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
  let cButton = createButton("Bottom Left");
  cButton.parent('button-holder1');
  cButton.mousePressed(coilVisibility1);
  cButton.style("background-color", "#ffb5f5");
  cButton.style("padding","1em");
  cButton.style("cursor","pointer");
  cButton.style("border-color","#c718af");
  cButton.style('font-family','Futura');
  cButton.style('font-size','20px');
  cButton.style('color','#8a0077');
    
      let cButton2 = createButton("Bottom Right");
  cButton2.parent('button-holder2');
  cButton2.mousePressed(coilVisibility2);
  cButton2.style("background-color", "#ffb5f5");
  cButton2.style("padding","1em");
  cButton2.style("cursor","pointer");
  cButton2.style("border-color","#c718af");
  cButton2.style('font-family','Futura');
  cButton2.style('font-size','20px');
  cButton2.style('color','#8a0077');
    
  let cButton3 = createButton("Top Left");
  cButton3.parent('button-holder3');
  cButton3.mousePressed(coilVisibility3);
  cButton3.style("background-color", "#ffb5f5");
  cButton3.style("padding","1em");
  cButton3.style("cursor","pointer");
  cButton3.style("border-color","#c718af");
  cButton3.style('font-family','Futura');
  cButton3.style('font-size','20px');
  cButton3.style('color','#8a0077');
    
    let cButton4 = createButton("Top Right");
  cButton4.parent('button-holder4');
  cButton4.mousePressed(coilVisibility4);
  cButton4.style("background-color", "#ffb5f5");
  cButton4.style("padding","1em");
  cButton4.style("cursor","pointer");
  cButton4.style("border-color","#c718af");
  cButton4.style('font-family','Futura');
  cButton4.style('font-size','20px');
  cButton4.style('color','#8a0077');

}


function draw(){
    background(231, 186, 255);
    orbitControl();
    
    pointLight(140, 175, 255,200,100,300);
    pointLight(140, 175, 255,-200,100,300);
    pointLight(155, 225, 255, 0,-500,-300);
    spotLight();
    
    createOven();
    if (showCoil1){
       createCoil(-70,-150,70);
    }
    if (showCoil2){
       createCoil(70,-150,70);
    }
     if (showCoil3){
       createCoil(-70,-150,-70);
    }
     if (showCoil4){
       createCoil(70,-150,-70);
    }
    
    
    createTemp();
    createChicken();
    createDoor();
}

function createOven(){
    //oven
    push();
    translate(0,0,0);
    scale(2);
    noStroke();
    rotateX(180);
    rotateY(90);
    specularMaterial(150);
    shininess(100);
    texture(ovenColor);
    model(oven);
    pop();
}

function createCoil(x,y,z){
    //oven coil
    push();
    translate(x,y,z);
    scale(0.5);
    noStroke();
    emissiveMaterial(255, 43, 241);
    shininess(80);
    model(coil);
    pop();
}

function createTemp(){
    push();
    translate(-130,-145,177);
    noStroke();
    emissiveMaterial(255,255,255);
    rect(0,0,50,20,10);
    rect(70,0,50,20,10);
    rect(140,0,50,20,10);
    rect(210,0,50,20,10);
    pop();
}

function createDoor(){
    push();
    noStroke();
    fill(199, 242, 255,100);
    translate(0,50,155);
    box(200,220,10);
    translate(0,120,0);
    fill(19, 22, 82);
    specularMaterial(150);
    shininess(100);
    box(300,50,15);
    translate(125,-150,0);
    box(50,250,15);
    translate(-250,0,0);
    box(50,250,15);
    translate(125,-100,0);
    box(300,50,15);
    pop();
}

function createChicken(){
    push();
    translate(0,30,40);
    scale(0.7);
    noStroke();
    rotateY(90);
    rotateX(180);
    emissiveMaterial(184, 118, 57);
    texture(chickenColor);
    model(chicken);
    pop();
}

function coilVisibility1(){
    showCoil1 = !showCoil1;
}

function coilVisibility2(){
    showCoil2 = !showCoil2;
}

function coilVisibility3(){
    showCoil3 = !showCoil3;
}

function coilVisibility4(){
    showCoil4 = !showCoil4;
}

