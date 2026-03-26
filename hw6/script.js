// Basic Three.js Example
// Chelsea Thompto - Spring 2026

// Three.js uses an import map to add features.
// The "import * as THREE from 'three';" will be
// in all sketches. Add-ons will be added after.

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

// Run the "init" function which is like "setup" in p5.
init();

// Define initial scene
function init() {
    
//bloom setup
const BLOOM_SCENE = 1;

    const bloomLayer = new THREE.Layers();
    bloomLayer.set( BLOOM_SCENE );

    const params = {
        threshold: 0,
        strength: 1,
        radius: 0.5,
        exposure: 1
    };
    
    //bloom scene setup
    const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
    const materials = {};

    const renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.NeutralToneMapping;
    document.body.appendChild( renderer.domElement );

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;


    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const bloomRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { type: THREE.HalfFloatType } );
    const bloomComposer = new EffectComposer( renderer, bloomRenderTarget );
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
    const finalComposer = new EffectComposer( renderer, finalRenderTarget );
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

    // Setup camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 100 );

    
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
        const color = 0x006699;
        
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
        
        // backslash \n creates a new line in your message
        const message = 'Tuesday March 24 Demo\n Another line';
        //shape and size of message
        const shapes = font.generateShapes(message, 40);
        const textGeometry = new THREE.ShapeGeometry( shapes );
        
        //creates bounding box around text like in Illustrator
        textGeometry.computeBoundingBox();
        
        //translate to center like center align text
        const xMid = - 0.5 * ( textGeometry.boundingBox.max.x - 
        textGeometry.boundingBox.min.x );
        textGeometry.translate( xMid, 0, 0 );
        
        //add ojects to scene
        const text = new THREE.Mesh ( textGeometry, matLite );
        text.position.y = 50;
        text.position.z = -200;
        text.position.x = 50;
        scene.add (text);
        
    } );
    
    
    // Add world geometry
 //torus knot shape
    //const coolShape = new THREE.TorusKnotGeometry( 10,3,100,16 );
    //
    ////torus knot color
    //const knotColor = new THREE.MeshPhongMaterial ({color: 0x7f01a2});
    //const knotShape = new THREE.Mesh(coolShape, knotColor);
    //
    //knotShape.position.z = -300;
    //knotShape.position.y = 50;
    //scene.add( knotShape );

    
   
       //March 24 example material and object
    //const donut = new THREE.TorusGeometry( 50, 20, 16, 100 );
    //const donutMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    //
    //const torus = new THREE.Mesh( donut, donutMaterial );
    //torus.position.y =50;
    //torus.position.z = -250;
    //scene.add( torus );
    //
    //const donutLine = new THREE.MeshBasicMaterial ({color: 0x000000, wireframe:true});
    //torusLine = new THREE.Mesh( donut, donutLine );
    //torusLine.position.y =50;
    //torusLine.position.z = -250;
    //scene.add( torusLine );
    
    // Grouping of trees
    //const geometry = new THREE.ConeGeometry( 10, 60, 8, 1 );
    //const material = new THREE.MeshPhongMaterial( { color: 0x637326, flatShading: true } );
    //const mesh = new THREE.InstancedMesh( geometry, material, 500 );
    //const tree = new THREE.Object3D();
    //for ( let i = 0; i < 75; i ++ ) {
    //    tree.position.x = Math.random() * 250 - 125;
    //    tree.position.y = 0;
    //    tree.position.z = Math.random() * 250 - 125;
    //    tree.updateMatrix();
    //    mesh.setMatrixAt( i, tree.matrix );
    //}
    //scene.add( mesh );
    
    

    // Ground
    //const earth = new THREE.PlaneGeometry( 2000, 2000 );
    //const ground = new THREE.MeshPhongMaterial( { color: 0x402314, flatShading: true } );
    //const mesh2 = new THREE.InstancedMesh( earth, ground, 500 );
    //mesh2.translateY( -60 );
    //mesh2.rotateX( -1.5708 );
    //scene.add( mesh2 );
    
    

    // lights
    //const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    //dirLight1.position.set( 1, 1, 1 );
    //scene.add( dirLight1 );
//
    //const dirLight2 = new THREE.DirectionalLight( 0xffffff, 2 );
    //dirLight2.position.set( - 1, - 1, - 1 );
    //scene.add( dirLight2 );
//
    //const ambientLight = new THREE.AmbientLight( 0x555555 );
    //scene.add( ambientLight );
    
  
//call setupScene function
   setupScene();
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
    
   gemstoneMesh.rotation.y += 0.001;
    
    render();
    
     
}

function setupScene() {

    scene.traverse( disposeMaterial );
    scene.children.length = 0;

    // rotating gemstone
    const gemstone = new THREE.OctahedronGeometry(30, 0);
    const GemMaterial = new THREE.MeshPhysicalMaterial( { 
        color: 0x36cbd6, 
        transmission: 1.0, 
        roughness:0.0, 
        metalness:0.5,
        thickness: 2.0,} );
    gemstoneMesh = new THREE.Mesh( gemstone, GemMaterial );
    scene.add( gemstoneMesh );

        if ( Math.random() < 0.25 ) gemstoneMesh.layers.enable( BLOOM_SCENE );

    render();

}

// Function to render the scene using the camera.
function render() {
    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );

    // render the entire scene, then render bloom scene on top
    finalComposer.render();
    
    //from og code
    renderer.render( scene, camera );
}