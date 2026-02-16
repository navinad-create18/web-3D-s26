let pear;
let pearColor;
let pearScale = 1;

let woodTexture;

let pano;

let rl = 112;
let gl = 41;
let bl = 10;

let r = 255;
let g = 255;
let b = 255;

function preload(){
    pear = loadModel("assets/Pear_modelFinal.obj", true);
    pearColor = loadImage("assets/pear_text3.png");
    woodTexture = loadImage("assets/wood_text.png");
    pano = loadImage("assets/pano_background.jpg");
    
}

function setup(){
    let canvas = createCanvas(700,500,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
    let button = createButton("Save Image");
    button.parent("button-holder");
    button.mousePressed(saveScreen);
    button.style("background-color","#ffba42");
    button.style("font-family", "Futura");
    button.style("font-size", "20px");
    button.style("cursor", "pointer");
    button.style("padding", "1em");
    
  camera(
    0, 0, 100, 0, 0, 1000,0, 1, 0
  );
}


function draw(){
    
    orbitControl();
    
    push();
    panorama(pano);
    pop();
    
    
    imageLight(pano);
    pointLight(rl,gl,bl,-500,300,100);
  
    createPear(0,0,1000, pearScale);
    createPear(150,0,1000, pearScale);
    createPear(-150,0,1000, pearScale);
    createTable();
}

function createPear(x,y,z,s){
    //pear
    push();
    translate(x,y,z);
    scale(s);
    noStroke();
    rotateX(180);
    tint(r,g,b,255);
    texture(pearColor); 
    model(pear);
    noTint();
    pop();
}

function createTable(){
    //table    
    push();
    noStroke();
    translate(0,110,1000);
    texture(woodTexture);
    box(600,30,400);
    translate(250,150,170);
    box(50,300,50);
    translate(-500,0,0);
    box(50,300,50);
    translate(0,0,-330);
    box(50,300,50);
    translate(500,0,0);
    box(50,300,50);
    pop();
}

function keyPressed(){
    //change pear color
    if (key == "c" || key == "C"){
        r = random(255);
        g = random(255);
        b = random(255);
    }
    
    //grow pears
    else if (key === '1'){
        pearScale += 0.1;
    }
    //shrink pears
    else if (key === '2'){
        pearScale -= 0.1;
    }
    //change light color
    else if (key == 'l' || key =="L"){
        rl = random(255);
        gl = random(255);
        bl = random(255);
    }
}

function saveScreen() {
    save(canvas, 'Pear_Party.png');
}



    



