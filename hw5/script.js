// Basic Three.js Example
// Chelsea Thompto - Spring 2026

// Three.js uses an import map to add features.
// The "import * as THREE from 'three';" will be
// in all sketches. Add-ons will be added after.

// The main library script
import * as THREE from 'three';

// The plug-in for orbit controls
import { OrbitControls } from './src/OrbitControls.js';

// Declaring global variables.
let camera, canvas, controls, scene, renderer;

// Run the "init" function which is like "setup" in p5.
init();

// Define initial scene
function init() {

    // scene setup
    canvas = document.getElementById("3-holder");
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbf1fff );
    //scene.fog = new THREE.FogExp2( 0xbfeff5, 0.0015 );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 400,400 );
    renderer.setAnimationLoop( animate );
    canvas.appendChild( renderer.domElement );

    // Setup camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 400, 200, 0 );

    // Setup controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); 
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.cursorStyle = 'grab';
    controls.maxPolarAngle = Math.PI / 2;

    // Add world geometry

    // Grouping of trees
    const geometry = new THREE.ConeGeometry( 10, 60, 8, 1 );
    const material = new THREE.MeshPhongMaterial( { color: 0xfc62c9, flatShading: true } );
    const mesh = new THREE.InstancedMesh( geometry, material, 500 );
    const tree = new THREE.Object3D();
    for ( let i = 0; i < 25; i ++ ) {
        tree.position.x = Math.random() * 300-150;
        tree.position.y = 0;
        tree.position.z = Math.random() * 300-150;
        tree.updateMatrix();
        mesh.setMatrixAt( i, tree.matrix );
    }
    scene.add( mesh );
    
     //sprinkles
    const sGeometry = new THREE.CapsuleGeometry( 2, 10, 20, 20, 1);
    const sMaterial = new THREE.MeshPhongMaterial({flatShading: true} );
    const capsule = new THREE.InstancedMesh( sGeometry, sMaterial, 50);
    const sprinkle = new THREE.Object3D();
    const color = new THREE.Color();
    
    capsule.translateX( 50 );
    capsule.translateY( -18 );
    //angle in radians!
    capsule.rotateX( 1.5708 );
    
    for ( let i = 0; i < 50; i ++ ) {
        sprinkle.position.x = Math.random() * 300-150;
        sprinkle.position.y = Math.random() * 300-150;
        sprinkle.rotation.x = Math.random() * Math.PI;
        sprinkle.updateMatrix();
        capsule.setMatrixAt( i, sprinkle.matrix );
        
        color.set(Math.random() *0xffffff);
        capsule.setColorAt( i, color );
    }
    
    
    scene.add( capsule );

    // Ground
    const earth = new THREE.PlaneGeometry( 2000, 2000 );
    const ground = new THREE.MeshPhongMaterial( { color: 0xfff2cf, flatShading: true } );
    const mesh2 = new THREE.InstancedMesh( earth, ground, 500 );
    mesh2.translateY( -20 );
    mesh2.rotateX( -1.5708 );
    scene.add( mesh2 );

    // lights
    const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight1.position.set( 1, 1, 1 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xffffff, 2 );
    dirLight2.position.set( - 1, - 1, - 1 );
    scene.add( dirLight2 );

    const ambientLight = new THREE.AmbientLight( 0xffffff );
    scene.add( ambientLight );
}

// Function to update moving objects, in this case the camera.
// The render function is trigger at the end to update the canvas.
function animate() {
    controls.update();
    render();
}

// Function to render the scene using the camera.
function render() {
    renderer.render( scene, camera );
}