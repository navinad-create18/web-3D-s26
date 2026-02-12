let pear;
let pearColor;
let woodTexture;
let pano;


function preload(){
    pear = loadModel("/assets/Pear_modelFinal.obj", true);
    pearColor = loadImage("/assets/pear_text3.png");
    woodTexture = loadImage("/assets/wood_text.png");
    pano = loadImage("/assets/pano_background.jpeg");
    
}

function setup(){
    let canvas = createCanvas(700,500,WEBGL);
    angleMode(DEGREES);
    
    canvas.parent('sketch-holder');
    
}

function draw(){
    
    
    panorama(pano);
    orbitControl();
    imageLight(pano);
  
    
       
    
    //pear
    noStroke();
    specularMaterial(105, 76, 18,20);
    rotateX(180);
    model(pear);
    texture(woodTexture);

 
    //table
    translate(0,-110,0);
    rotateX(180);
    box(600,30,400);
    texture(pearColor);
    
}



    



