let oven;
let ovenColor;
let coil;

let chicken;
let chickenColor;

//for temperature color control
let tempColor1;
let tempColor2;
let tempColor3;
let tempColor4;

//for temperature slider control/visibility
let slider1;
let showTemp1 = false;
let slider2;
let showTemp2 = false;
let slider3;
let showTemp3 = false;
let slider4;
let showTemp4 = false;

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
    
  colorMode(RGB,255,255,255,255);
  //color mode, hue, saturation, brightness, alpha
  
    
  slider1 = createSlider(0,255,0,0);
    //min value, max value, start, step 
  slider1.parent("slider-holder1");
    
  slider2 = createSlider(0,255,0,0);
  slider2.parent("slider-holder2");
    
  slider3 = createSlider(0,255,0,0);
  slider3.parent("slider-holder3");
    
  slider4 = createSlider(0,255,0,0);
  slider4.parent("slider-holder4");
  

    
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
    
    if (showTemp1){
      push();
      translate(-130,-145,177);
      noStroke();
      emissiveMaterial(tempColor1);
      fill(tempColor1);
      rect(0,0,50,20,10);
      pop();
    }
    
    if (showTemp2){
      push();
      translate(-130,-145,177);
      noStroke();
      emissiveMaterial(tempColor2);
      fill(tempColor2);
      rect(70,0,50,20,10);
      pop();
    }
    
     if (showTemp3){
      push();
      translate(-130,-145,177);
      noStroke();
      emissiveMaterial(tempColor3);
      fill(tempColor3);
      rect(140,0,50,20,10);
      pop();
    }
    
     if (showTemp4){
      push();
      translate(-130,-145,177);
      noStroke();
      emissiveMaterial(tempColor4);
      fill(tempColor4);
      rect(210,0,50,20,10);
      pop();
    }
    
    
    push();
    //rotateY(frameCount*1);
    createChicken();
    pop();
    
    createDoor();
    
    //sliders for temperature
    createTemp();
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
  let gValue1 = 255-slider1.value();
    //moves the slider from left to right based on color value
     tempColor1 = color(255,gValue1,0);
    //red is main color, no blue, green transitions between yellow and red
    let gValue2 = 255-slider2.value();
     tempColor2 = color(255,gValue2,0);
    let gValue3 = 255-slider3.value();
     tempColor3 = color(255,gValue3,0);
    let gValue4 = 255-slider4.value();
     tempColor4 = color(255,gValue4,0);
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
    translate(0,50,40);
    scale(0.7);
    noStroke();
    rotateY(90);
    rotateX(180);
    emissiveMaterial(184, 118, 57);
    texture(chickenColor);
    model(chicken);
    pop();
}

//bottom left
function coilVisibility1(){
    showCoil1 = !showCoil1;
    showTemp1 = !showTemp1;
}

//bottom right
function coilVisibility2(){
    showCoil2 = !showCoil2;
    showTemp2 = !showTemp2;
}

//top left
function coilVisibility3(){
    showCoil3 = !showCoil3;
    showTemp3 = !showTemp3;
}

//top right
function coilVisibility4(){
    showCoil4 = !showCoil4;
    showTemp4 = !showTemp4;
}

