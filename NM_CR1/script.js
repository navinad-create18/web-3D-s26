// Basic Three.js Example
// Chelsea Thompto - Spring 2026

// Three.js uses an import map to add features.
// The "import * as THREE from 'three';" will be
// in all sketches. Add-ons will be added after.

// The main library script
import * as THREE from 'three';

// The plug-in for orbit controls
import { OrbitControls } from './src/OrbitControls.js';

//The plug-in to load glb models
import { GLTFLoader } from './src/GLTFLoader.js';

//The plug-in for First Person Controls
import { PointerLockControls } from './src/PointerLockControls.js';

// Declaring global variables.
let camera, canvas, controls, scene, renderer;
let branches, hills;

//Variables for First Person Controls
let raycaster;

const objects = [];

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

    // scene setup
    canvas = document.getElementById("3-holder");
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfeff5 );
    scene.fog = new THREE.FogExp2( 0xbfeff5, 0.0015 );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setAnimationLoop( animate );
    canvas.appendChild( renderer.domElement );

    // Setup camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 0 );

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

        //for bear and ice movement
        case 'KeyM':
            melt = true;
            break;

        case 'KeyF':
            freeze = true;
            break;
    } //end bear and ice movement keys

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
        //bear and ice movement
        case 'KeyM':
                melt = false;
                break;
                
            case 'KeyF':
                freeze = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    //End of First person setup

    // Add world geometry
// load scene
    const loader = new GLTFLoader();
        loader.load( './assets/TreeHouseScape2.glb',  function ( gltf ) {

            hills = gltf.scene;
            hills.scale.set (40,40,40);
            hills.position.set(0,0,-80);
            scene.add( hills ); 

            loader.load( './assets/branchesJump.glb',  function ( gltf ) {

            branches = gltf.scene;
            branches.scale.set (40,40,40);
            branches.position.set(0,0,-80);
            
            scene.add( branches ); 
            objects.push(branches);

            
        }, undefined, function ( e ) {

            console.error( e );
            });
        } );
    
    //house floor
    const treeHouse1 = new THREE.BoxGeometry( 20, 31,0.5 );
    const houseFloor1 = new THREE.MeshPhongMaterial( { color: 0x402314, flatShading: true } );
    const mesh3 = new THREE.Mesh( treeHouse1, houseFloor1, 10 );
    mesh3.position.set(-14,66,-90);
    mesh3.rotateX( -1.5708 );
    scene.add( mesh3 );
    objects.push(mesh3);
    
    const treeHouse2 = new THREE.BoxGeometry( 16, 31,0.5 );
    const houseFloor2 = new THREE.MeshPhongMaterial( { color: 0x402314, flatShading: true } );
    const mesh4 = new THREE.Mesh( treeHouse2, houseFloor2, 10 );
    mesh4.position.set(17,66,-90);
    mesh4.rotateX( -1.5708 );
    scene.add( mesh4 );
    objects.push(mesh4);
    
    const treeHouse3 = new THREE.BoxGeometry( 20, 13,0.5 );
    const houseFloor3 = new THREE.MeshPhongMaterial( { color: 0x402314, flatShading: true } );
    const mesh5 = new THREE.Mesh( treeHouse3, houseFloor3, 10 );
    mesh5.position.set(0,66,-98);
    mesh5.rotateX( -1.5708 );
    scene.add( mesh5 );
    objects.push(mesh5);
    
    const treeHouse4 = new THREE.BoxGeometry( 20, 12,0.5 );
    const houseFloor4 = new THREE.MeshPhongMaterial( { color: 0x402314, flatShading: true } );
    const mesh6 = new THREE.Mesh( treeHouse4, houseFloor4, 10 );
    mesh6.position.set(0,66,-78);
    mesh6.rotateX( -1.5708 );
    scene.add( mesh6 );
    objects.push(mesh6);
    
    //loading photos
    const texture1 = new THREE.TextureLoader().load( './assets/Flower1.JPG' );
    const texture2 = new THREE.TextureLoader().load( './assets/Flower2.JPG' );
    const texture3 = new THREE.TextureLoader().load( './assets/Flower3.JPG' );
    const texture4 = new THREE.TextureLoader().load( './assets/Flower4.JPG' );
    
    //photos
    const photo1 = new THREE.PlaneGeometry( 10, 13 );
    const frame1 = new THREE.MeshBasicMaterial( { map: texture1 } );
    const mesh7 = new THREE.Mesh( photo1,frame1, 10 );
    mesh7.position.set(10,75,-73);
    mesh7.rotateY( 3.14159 );
    scene.add( mesh7 );
    
    const photo2 = new THREE.PlaneGeometry( 10, 13 );
    const frame2 = new THREE.MeshBasicMaterial( { map: texture2 } );
    const mesh8 = new THREE.Mesh( photo2,frame2, 10 );
    mesh8.position.set(0,80,-103);
    //mesh8.rotateY( 3.14159 );
    scene.add( mesh8 );
    
    const photo3 = new THREE.PlaneGeometry( 10, 13 );
    const frame3 = new THREE.MeshBasicMaterial( { map: texture3 } );
    const mesh9 = new THREE.Mesh( photo3,frame3, 10 );
    mesh9.position.set(15,80,-103);
    scene.add( mesh9 );
    
    const photo4 = new THREE.PlaneGeometry( 10, 13 );
    const frame4 = new THREE.MeshBasicMaterial( { map: texture4 } );
    const mesh10 = new THREE.Mesh( photo4,frame4, 10 );
    mesh10.position.set(-15,80,-103);
    scene.add( mesh10 );
        
    

    // Ground
    const earth = new THREE.PlaneGeometry( 2000, 2000 );
    const ground = new THREE.MeshPhongMaterial( { color: 0x402314, flatShading: true } );
    const mesh2 = new THREE.Mesh( earth, ground, 500 );
    mesh2.translateY( -60 );
    mesh2.rotateX( -1.5708 );
    scene.add( mesh2 );

    // lights
    const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight1.position.set( 1, 1, 1 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xffffff, 2 );
    dirLight2.position.set( - 1, - 1, - 1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0x555555 );
    scene.add( ambientLight );
}

// Function to update moving objects, in this case the camera.
// The render function is trigger at the end to update the canvas.
function animate() {
    
   
  //Start First Person Control Animations
    const time = performance.now();
    const delta = ( time - prevTime ) / 1000;
        prevTime = time;
    
    if ( controls.isLocked === true ) {
        
        raycaster.ray.origin.copy( controls.object.position );
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects( objects, true );

        const onObject = intersections.length > 0;

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
        
        if ( onObject === true ) {

        velocity.y = Math.max( 0, velocity.y );
        canJump = true;

    }
 
        controls.object.position.y += ( velocity.y * delta ); // new behavior 
        
        	if (controls.object.position.y < 10) {
            velocity.y = 0;
            controls.object.position.y = 10;
            canJump = true;
            }
    }

    //End First Person Control Animations
    
    renderer.render( scene, camera );
}

// Function to render the scene using the camera.
function render() {
    renderer.render( scene, camera );
}