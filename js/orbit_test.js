if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cross;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
  camera.position.z = 20;

  // world
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  function box( x, y, z, x_offset = 0, y_offset = 0, z_offset = 0, scale = 10, size = 0.1  ) {
    var geometry1 = new THREE.BoxGeometry( x, y, z, x * scale, y * scale, z * scale );
    var vertices = geometry1.vertices;
  
    var positions = new Float32Array( vertices.length * 3 );
  
    var vertex;
    var color = new THREE.Color();
    for ( var i = 0, l = vertices.length; i < l; i ++ ) {
      vertex = vertices[ i ];
      vertex.toArray( positions, i * 3 );
    }
  
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.translate( x_offset, y_offset, z_offset );

    var material = new THREE.PointsMaterial( 0x004080 );
    material.size = size;
  
    particles = new THREE.Points( geometry, material );
    scene.add( particles );
  }

  box( 10, 10, 10 );

  // light
  scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

  // renderer
  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );


  // Controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = Math.PI * 3 / 4; // radians

  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.5;
  controls.panSpeed = 0.8;

  controls.enableZoom = true;
  controls.enablePan = true;

  controls.minDistance = 2.5;
  controls.maxDistance = 30;

  controls.enableDamping = false;
  controls.dampingFactor = 0.5;

  controls.keys = [ 65, 83, 68 ];

  controls.addEventListener( 'change', render );

  window.addEventListener( 'resize', onWindowResize, false );

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
}
