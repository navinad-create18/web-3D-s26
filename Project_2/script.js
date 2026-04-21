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

//The plug-in to load glb models
import { GLTFLoader } from './src/GLTFLoader.js';

// Declaring global variables.
let camera, canvas, controls, scene, renderer;

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

let assetsScene;

// Run the "init" function which is like "setup" in p5.
init();

// Define initial scene
function init() {

    // scene setup
    canvas = document.getElementById("3-holder");
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf5bfbf );
    scene.fog = new THREE.FogExp2( 0xfa68bc, 0.006 );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setAnimationLoop( animate );
    canvas.appendChild( renderer.domElement );
    

    // Setup camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 0 );
    camera.scale.set(0.5,0.5,0.5);

    // Setup Orbit controls
    //controls = new OrbitControls( camera, renderer.domElement );
    //controls.listenToKeyEvents( window ); 
    //controls.enableDamping = true; 
    //controls.dampingFactor = 0.05;
    //controls.screenSpacePanning = false;
    //controls.minDistance = 100;
    //controls.maxDistance = 500;
    //controls.cursorStyle = 'grab';
    //controls.maxPolarAngle = Math.PI / 2;
    
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
            if ( canJump === true ) velocity.y += 300;
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

    //load assets
    const loader = new GLTFLoader();
        loader.load( './assets/Project2_sceneFinal2.glb',  function ( gltf ) {

            assetsScene = gltf.scene;
            assetsScene.scale.set (0.5,0.5,0.5);
            assetsScene.position.set(0,0,-60);
            assetsScene.translateY(5);
            
         
            
            
            scene.add( assetsScene ); 
        },undefined, function ( e ) {

            console.error( e );

        } );
    
  

      
    
    //Add font and text
    //const loader = new FontLoader();
    //loader.load('./IosevkaCharon_Mono_Bold.json', function (font){
    //    
    //    //create color and material
    //    const color = 0xd70a6a;
    //    
    //    const matDark = new THREE.LineBasicMaterial( {
    //        color: color,
    //        side: THREE.DoubleSide
    //    } );
    //    
    //    const matLite = new THREE.MeshBasicMaterial( {
    //        color: color,
    //        transparent: true,
    //        opacity: 0.4,
    //        side: THREE.DoubleSide
    //    } );
    //    
    //    // backslash \n creates a new line in your message
    //    const message = 'Tuesday March 24 Demo\n Another line';
    //    //shape and size of message
    //    const shapes = font.generateShapes(message, 40);
    //    const textGeometry = new THREE.ShapeGeometry( shapes );
    //    
    //    //creates bounding box around text like in Illustrator
    //    textGeometry.computeBoundingBox();
    //    
    //    //translate to center like center align text
    //    const xMid = - 0.5 * ( textGeometry.boundingBox.max.x - 
    //    textGeometry.boundingBox.min.x );
    //    textGeometry.translate( xMid, 0, 0 );
    //    
    //    //ad ojects to scene
    //    const text = new THREE.Mesh ( textGeometry, matLite );
    //    text.position.y = 50;
    //    text.position.z = -200;
    //    text.position.x = 50;
    //    scene.add (text);
    //    
    //} );
    
    
    // Add world geometry
 //torus knot shape
    const coolShape = new THREE.TorusKnotGeometry( 10,3,100,16 );
    
    
     //Grouping of trees
    
    const forest = puffyTrees();
    for (let i = 0; i < 70; i++){
        const trees = forest.clone(true);
        
        trees.position.set(
        Math.random() *300 -200, 0, Math.random() * 300-200 );
        
        scene.add(trees);
    }
    
    
    
    

    // Ground
    const earth = new THREE.PlaneGeometry( 2000, 2000 );
    const ground = new THREE.MeshPhongMaterial( { color: 0xffdce5, flatShading: true } );
    const mesh2 = new THREE.InstancedMesh( earth, ground, 500 );
    mesh2.translateY( 0 );
    mesh2.rotateX( -1.5708 );
    scene.add( mesh2 );
    
    

    // lights
    const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight1.position.set( 1, 1, 1 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xffffff, 2 );
    dirLight2.position.set( - 1, - 1, - 1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0xe69999 );
    scene.add( ambientLight );
    
   
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
        
        //adjust gravity
        velocity.y -= 9.8 * 50.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        //change number before delta to change speed
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        
        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
        
           // space limiting code adjust numbers to fit your space
        // use geometery size and numbers as reference

        if (controls.object.position.x > 20) {
            controls.object.position.x = 19;
        } else if (controls.object.position.x < -20) {
            controls.object.position.x = -19;
        }

        if (controls.object.position.z > 62) {
            controls.object.position.z = 61;
        } else if (controls.object.position.z < -62) {
            controls.object.position.z = -61;
        }

            controls.object.position.y += ( velocity.y * delta ); // new behavior 
        
        	if (controls.object.position.y < 10) {
            //adjust jump height
            velocity.y = -180;
            controls.object.position.y = 10;
            canJump = true;
            }

    }

    prevTime = time;

    //End First Person Control Animations
    
    renderer.render( scene, camera );
}

// Function to render the scene using the camera.
function render() {
    
    renderer.render( scene, camera );
    
}

function puffyTrees(x,y,z){
    const forest = new THREE.Group();
    
    const treeTop = new THREE.SphereGeometry( 15, 32, 16 );
    const treeTopMaterial = new THREE.MeshPhongMaterial( { color: 0xff91a7 } );
    const treeTopMesh = new THREE.Mesh( treeTop, treeTopMaterial );
    scene.add( treeTopMesh );
    treeTopMesh.position.set (-5,27,-100);
    treeTopMesh.scale.set(0.4,0.3,0.4);
    
    const treeTopMesh2 = new THREE.Mesh( treeTop, treeTopMaterial );
    scene.add( treeTopMesh2 );
    treeTopMesh2.position.set (2,22,-105);
    treeTopMesh2.scale.set(0.4,0.3,0.4);
    
    const treeTopMesh3 = new THREE.Mesh( treeTop, treeTopMaterial );
    scene.add( treeTopMesh3 );
    treeTopMesh3.position.set (-10,20,-95);
    treeTopMesh3.scale.set(0.5,0.5,0.5);
    
     const treeTopMesh4 = new THREE.Mesh( treeTop, treeTopMaterial );
    scene.add( treeTopMesh4 );
    treeTopMesh4.position.set (7,19,-100);
    treeTopMesh4.scale.set(0.3,0.4,0.4);
    
    const treeTopMesh5 = new THREE.Mesh( treeTop, treeTopMaterial );
    scene.add( treeTopMesh5 );
    treeTopMesh5.position.set (3,20,-97);
    treeTopMesh5.scale.set(0.3,0.4,0.4);
    
    const treeTopMesh6 = new THREE.Mesh( treeTop, treeTopMaterial );
    scene.add( treeTopMesh6 );
    treeTopMesh6.position.set (-3,20,-100);
    treeTopMesh6.scale.set(0.3,0.4,0.4);
    
    //tree trunk
    const treeTrunk = new THREE.CylinderGeometry( 2, 2, 35, 16 );
    const treeTrunkMaterial = new THREE.MeshPhongMaterial( { color: 0x331336 } );
    const treeTrunkMesh = new THREE.Mesh(treeTrunk, treeTrunkMaterial);
    scene.add( treeTrunkMesh);
    treeTrunkMesh.position.set(-3,0,-100);
    treeTrunkMesh.scale.set(1,1,1);
    
    //adds meshes to group
    forest.add(treeTopMesh);
    forest.add(treeTopMesh2);
    forest.add(treeTopMesh3);
    forest.add(treeTopMesh4);
    forest.add(treeTopMesh5);
    forest.add(treeTopMesh6);
    forest.add(treeTrunkMesh);
    
    return forest;
       //for ( let i = 0; i < 75; i ++ ) {
       // tree.position.x = Math.random() * 250 - 125;
       // tree.position.y = 0;
       // tree.position.z = Math.random() * 250 - 125;
       // tree.updateMatrix();
       // mesh.setMatrixAt( i, tree.matrix );
    //}
    

}