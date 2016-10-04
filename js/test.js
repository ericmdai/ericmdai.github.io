if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cross;

init();
animate();

function init() {

  // camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
  camera.position.z = 2;

  // world

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog( 0x72645b, 2, 15 );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  // PLY file
  var loader = new THREE.PLYLoader();
  loader.load( './models/dolphins.ply', function ( geometry ) {
    geometry.computeVertexNormals();
    var material = new THREE.MeshStandardMaterial( { color: 0x0055ff, shading: THREE.FlatShading } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = - 0.25;
    mesh.rotation.x = - Math.PI / 2;
    mesh.scale.multiplyScalar( 0.001 );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );
  } );


  // lights
  scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
  addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
  addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );

  // renderer

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  stats = new Stats();
  container.appendChild( stats.dom );

  controls = new THREE.TrackballControls( camera, renderer.domElement );

  controls.rotateSpeed = 10.0;
  controls.zoomSpeed = 0.01;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = true;

  // controls.staticMoving = true;
  // controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  controls.addEventListener( 'change', render );

  //

  window.addEventListener( 'resize', onWindowResize, false );
  //

  render();

}

function addShadowedLight( x, y, z, color, intensity ) {

  var directionalLight = new THREE.DirectionalLight( color, intensity );
  directionalLight.position.set( x, y, z );
  scene.add( directionalLight );

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.bias = -0.005;

}


function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  controls.handleResize();

  render();

}

function animate() {

  requestAnimationFrame( animate );
  controls.update();

  render();
}

function render() {

  renderer.render( scene, camera );
  stats.update();

}