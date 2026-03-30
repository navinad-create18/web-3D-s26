//code for bloom effect: https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html

// The main library script
import * as THREE from 'three';

// The plug-in for orbit controls
import { OrbitControls } from './src/OrbitControls.js';

//The plug-in for First Person Controls
import { PointerLockControls } from './src/PointerLockControls.js';

//The plug-in for Font Loader
import { FontLoader } from './src/FontLoader.js';

//for glow effect of gem
import { EffectComposer } from './src/EffectComposer.js';
import { RenderPass } from './src/RenderPass.js';
import { ShaderPass } from './src/ShaderPass.js';
import { UnrealBloomPass } from './src/UnrealBloomPass.js';
import { OutputPass } from './src/OutputPass.js';
import { RoomEnvironment } from './src/RoomEnvironment.js';

// Declaring global variables.
let camera, canvas, controls, scene, renderer;

//variables for animated elements
let gemstoneMesh;
let torusLine;

//Variables for First Person Controls
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

//bloom effect for glow
const BLOOM_SCENE = 1;
let bloomComposer;
let finalComposer;
let darkMaterial;
let bloomLayer;
let materials = {};

// Run the "init" function which is like "setup" in p5.
init();

// Define initial scene
function init() {
    
//bloom setup


    bloomLayer = new THREE.Layers();
    bloomLayer.set( BLOOM_SCENE );

    const params = {
        threshold: 0,
        strength: 1,
        radius: 0.5,
        exposure: 1
    };
    
    //bloom scene setup
    darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
    materials = {};

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.NeutralToneMapping;
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

// Setup camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 100 );
    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const bloomRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { type: THREE.HalfFloatType } );
    bloomComposer = new EffectComposer( renderer, bloomRenderTarget );
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass( renderScene );
    bloomComposer.addPass( bloomPass );

    const mixPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture },
                bloomStrength: { value: params.strength }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            defines: {}
        } ), 'baseTexture'
    );
    mixPass.needsSwap = true;

    const outputPass = new OutputPass();

    const finalRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { type: THREE.HalfFloatType, samples: 4 } );
    finalComposer = new EffectComposer( renderer, finalRenderTarget );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( mixPass );
    finalComposer.addPass( outputPass );

    
    // original scene setup
    //canvas = document.getElementById("3-holder");
    //scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0xbfeff5 );
    //scene.fog = new THREE.FogExp2( 0xbfeff5, 0.0015 );
    //renderer = new THREE.WebGLRenderer( { antialias: true } );
    ////renderer.setPixelRatio( window.devicePixelRatio );
    //renderer.setSize( innerWidth, innerHeight );
    //renderer.setAnimationLoop( animate );
    //canvas.appendChild( renderer.domElement );


    
    // Setup First Person Controls
    controls = new PointerLockControls( camera, document.body );

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {
controls.lock();
        
        controls.lock();

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );

    scene.add( controls.object );

    const onKeyDown = function ( event ) {

        switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;

        }

    };

    const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    //End of First person setup

    //Add font and text
    const loader = new FontLoader();
    loader.load('./IosevkaCharon_Mono_Bold.json', function (font){
        
        //create color and material
        const color = 0x51ad83;
        
        const matDark = new THREE.LineBasicMaterial( {
            color: color,
            side: THREE.DoubleSide
        } );
        
        const matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        } );
        
        const matLite2 = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        } );
        
        // backslash \n creates a new line in your message
        const message = 'Magic Gem';
        const message2 = 'in a Mysterious Place';
        //shape and size of message
        const shapes = font.generateShapes(message, 40);
        const shapes2 = font.generateShapes(message2,15);
        const textGeometry = new THREE.ShapeGeometry( shapes );
        const textGeometry2 = new THREE.ShapeGeometry( shapes2 );
        
        //creates bounding box around text like in Illustrator
        textGeometry.computeBoundingBox();
        textGeometry2.computeBoundingBox();
        
        //translate to center like center align text
        const xMid = - 0.5 * ( textGeometry.boundingBox.max.x - 
        textGeometry.boundingBox.min.x );
        textGeometry.translate( xMid, 10, -30 );
        
        const xMid2 = - 0.5 * ( textGeometry2.boundingBox.max.x - 
        textGeometry2.boundingBox.min.x );
        textGeometry2.translate( xMid2, 10, -30 );
        
        //add ojects to scene
        const text = new THREE.Mesh ( textGeometry, matLite );
        text.position.y = 140;
        text.position.z = -200;
        text.position.x = 0;
        scene.add (text);
        
        const text2 = new THREE.Mesh ( textGeometry2, matLite2 );
        text2.position.y = 100;
        text2.position.z = -200;
        text2.position.x = 0;
        scene.add (text2);
        
    } );
    
    
    // Add rocks
    
    //scattered rocks
    const rockGeom = new THREE.DodecahedronGeometry();
    const rockMaterial = new THREE.MeshPhongMaterial( { color: 0x47403b } );
    const rocks = new THREE.InstancedMesh( rockGeom, rockMaterial, 75 );
    const rockGroup = new THREE.Object3D();
    
    for ( let i = 0; i < 75; i ++ ) {
        rockGroup.position.x = Math.random() * 250 - 125;
        rockGroup.position.y = 0;
        rockGroup.position.z = Math.random() * 325 - 325;
        
        //random scale
        const scale = Math.random() * 10 + 1;
        rockGroup.scale.set (scale,scale,scale);
    
        
        rockGroup.updateMatrix();
        rocks.setMatrixAt( i, rockGroup.matrix );
    }
    
    scene.add( rocks );
    
    
    //cylinder
    const columnGeo = new THREE.CylinderGeometry( 5, 5, 20, 32 );
    const columnMat = new THREE.MeshPhongMaterial( { color: 0x1d4021, wireframe: true } );
    const cylinder = new THREE.Mesh( columnGeo, columnMat );
    
    cylinder.position.set (-150,100,-300);
    cylinder.scale.set (8,12,8);
    scene.add( cylinder );
    
    //cone
    const geometry = new THREE.ConeGeometry( 5, 20, 32 );
    const material = new THREE.MeshBasicMaterial( { color: 0x1d4021, wireframe: true } );
    const cone = new THREE.Mesh(geometry, material );
    
    cone.scale.set(8,12,8);
    cone.position.set(150,100,-300);
    scene.add( cone );

    //circle
    const floor = new THREE.SphereGeometry( 10,32,10 );
    const floorMaterial = new THREE.MeshPhongMaterial( { color: 0x1f3489,specular: 0x5e891f , shininess: 100 } );
    const floorMesh = new THREE.Mesh( floor, floorMaterial );
    
    floorMesh.rotation.x = 30;
    floorMesh.scale.set (10,10,10);
    floorMesh.position.set (0,-100,-150);
    scene.add( floorMesh );

    
    
    // lights
    const ambientLight = new THREE.AmbientLight( 0x76daa5 );
    scene.add( ambientLight );
    
    // White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0x8af17e, 1 );
    directionalLight.scale.set (10,10,10);
scene.add( directionalLight );

    
  
//call setupScene function
   setupScene();
    renderer.setAnimationLoop(animate);
}

// Function to update moving objects, in this case the camera.
// The render function is trigger at the end to update the canvas.
function animate() {
    
    //Start First Person Control Animations
    const time = performance.now();
    
    
    if ( controls.isLocked === true ) {
        
        const delta = ( time - prevTime ) / 1000;
        
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;


        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.object.position.y += ( velocity.y * delta ); // new behavior 

        if (controls.object.position.y < 10) {
        velocity.y = 0;
        controls.object.position.y = 10;
        canJump = true;
        }
    }

    prevTime = time;

    //End First Person Control Animations
    if(gemstoneMesh){
    gemstoneMesh.rotation.y += 0.001;
    }
    render();
    
     
}

function setupScene() {
    //scene.children.length = 0;

    // rotating gemstone and glow
    const gemstone = new THREE.OctahedronGeometry(30, 0);
    const GemMaterial = new THREE.MeshPhysicalMaterial( { 
        color: 0x36cbd6, 
        transmission: 1.0, 
        roughness:0.0, 
        metalness:0.5,
        thickness: 2.0,} );
    gemstoneMesh = new THREE.Mesh( gemstone, GemMaterial );
    scene.add( gemstoneMesh );

        gemstoneMesh.layers.enable( BLOOM_SCENE );
    gemstoneMesh.position.set (0,50,-200);

    render();

}

// Function to render the scene using the camera.
function render() {

    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );

    // render the entire scene, then render bloom scene on top
    finalComposer.render();

}

function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

    }

}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }

}