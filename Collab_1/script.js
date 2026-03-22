// Three.js uses an import map to add features.
// The "import * as THREE from 'three';" will be
// in all sketches. Add-ons will be added after.

// water and sky shaders referenced at this link: https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html

// The main library script
import * as THREE from 'three';

// The plug-in for orbit controls
import { OrbitControls } from './src/OrbitControls.js';

//The plug-in for First Person Controls
import { PointerLockControls } from './src/PointerLockControls.js';

//The plug-in to load glb models
import { GLTFLoader } from './src/GLTFLoader.js';

//Import water shader
import { Water } from './src/Water.js';

let water;

//Import stats for water loading
import Stats from './src/stats.module.js';
let stats;

//Import Sky
import { Sky } from './src/Sky.js';
let sky;		

// Declaring global variables.
let camera, canvas, controls, scene, renderer, bear, iceBlock, iceBlocks;

//movement variables for ice and bear movement
let melt = false;
let freeze = false;

const moveUpBearY = 5; //starting position of bear and ice
const moveUpIceY = 0;
const moveDownIceY = -50;
const moveDownBearY = -45;
const iceSpeed = 30;


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

    // scene setup
    canvas = document.getElementById("3-holder");
    scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2( 0xbfeff5, 0.0015 );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setAnimationLoop( animate );
    canvas.appendChild( renderer.domElement );
    
    
    // Setup camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 200 );
    
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
            if ( canJump === true ) velocity.y += 350;
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
    
    
       // load polar bear
    const loader = new GLTFLoader();
        loader.load( './assets/polar_bear_full.glb',  function ( gltf ) {

            bear = gltf.scene;
            bear.scale.set (10,10,10);
            bear.position.set(0,5,0);
            bear.translateY(5);
            scene.add( bear ); 
                
            //load ice sheet
            loader.load( './assets/ice_block.glb', function ( gltf ) {

            iceBlock = gltf.scene;
            iceBlock.scale.set (10,10,10);
            iceBlock.position.set(50,0,0);
            scene.add( iceBlock );

        }, undefined, function ( e ) {

            console.error( e );

        } );
            
            //load ice blocks
            loader.load( './assets/ice_blocks.glb', function ( gltf ) {

            iceBlocks = gltf.scene;
            iceBlocks.scale.set (10,10,10);
            iceBlocks.position.set(50,0,0);
            scene.add( iceBlocks );

        }, undefined, function ( e ) {

            console.error( e );

        } );
        
        } );   

    //Code for Audio
    const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listener);

audioLoader.load('./assets/Akon_Lonely.mp3', function(buffer) {
	backgroundSound.setBuffer(buffer);
	backgroundSound.setLoop(true);
	backgroundSound.setVolume(0.4);

	// Try autoplay if user already allowed it before
	if (localStorage.getItem("audioEnabled") === "true") {
		if (listener.context.state === "suspended") {
			listener.context.resume().then(() => {
				backgroundSound.play();
			});
		} else {
			backgroundSound.play();
		}
	}
});
	
	document.addEventListener("click", () => {
	localStorage.setItem("audioEnabled", "true");

	if (listener.context.state === "suspended") {
		listener.context.resume().then(() => {
			if (!backgroundSound.isPlaying) {
				backgroundSound.play();
			}
		});
	} else {
		if (!backgroundSound.isPlaying) {
			backgroundSound.play();
		}
	}
}, { once: true });
    
    // Water

        const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

        water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( './assets/waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
            
        );

        water.rotation.x = - Math.PI / 2;
        water.position.y = 0;
        scene.add( water );
    
    // Skybox

        sky = new Sky();
        sky.scale.setScalar( 10000 );
        scene.add( sky );

        const skyUniforms = sky.material.uniforms;

        skyUniforms.turbidity.value = 10;
        skyUniforms.rayleigh.value = 2;
        skyUniforms.mieCoefficient.value = 0.005;
        skyUniforms.mieDirectionalG.value = 0.8;
        skyUniforms.cloudCoverage.value = 0.4;
        skyUniforms.cloudDensity.value = 0.5;
        skyUniforms.cloudElevation.value = 0.5;

        const parameters = {
            elevation: 2,
            azimuth: 180,
            exposure: 0.1
        };
    
//render sun from three.js example
    const sun = new THREE.Vector3();

const parameters2 = {
    elevation: 2,
    azimuth: 180
};

function updateSun() {

    const phi = THREE.MathUtils.degToRad(90 - parameters2.elevation);
    const theta = THREE.MathUtils.degToRad(parameters2.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value.copy(sun);
    water.material.uniforms.sunDirection.value.copy(sun).normalize();

}

updateSun();
    
    // Ground
    
    const earth = new THREE.PlaneGeometry( 2000, 2000 );
    const ground = new THREE.MeshPhongMaterial( { color: 0x402314, flatShading: true } );
    const mesh2 = new THREE.Mesh( earth, ground );
    mesh2.position.y= -65;
    mesh2.rotation.x = -1.5708;
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

    //End First Person Control Animations
    //
    //Start bear and ice animations
        if (melt){
            if (iceBlock && iceBlock.position.y > moveDownIceY){
                iceBlock.position.y -= (iceSpeed * delta);
            }
            if (bear && bear.position.y > moveDownBearY){
                bear.position.y -= (iceSpeed * delta);
            }
    }
        if (freeze){
            if (iceBlock && iceBlock.position.y < moveUpIceY){
                iceBlock.position.y += (iceSpeed* delta);
            }
            if (bear && bear.position.y < moveUpBearY){
                bear.position.y += (iceSpeed* delta);
            }
        }
    
    //limits bear and ice positions
    if (bear){
         bear.position.y = THREE.MathUtils.clamp(bear.position.y, moveDownBearY, moveUpBearY);
    }
    
    if (iceBlock){
    iceBlock.position.y = THREE.MathUtils.clamp(iceBlock.position.y, moveDownIceY, moveUpIceY);
    }
    //end bear and ice animations
    //
    //water animation, changed time to dot notation
    
    water.material.uniforms.time.value += 1.0 / 60.0;
      
     renderer.render( scene, camera );
   
}

// Function to render the scene using the camera.
function render() {
    
    renderer.render( scene, camera );
}