var fibonacci = document.getElementById( 'fibonacci' );

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor( 0x111111, 1 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
fibonacci.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
camera.position.set( 5.572598712768517, -66.57502631633189, 21.02674031080701 );
camera.rotation.set( 1.2322882126233607, 0.07273216646669994, -0.203550046101327 );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.target.set( 0.5518566227733895, -0.7508918311572805, -2.2539378789116693 );

var scene = new THREE.Scene();

//

var outerSpiralGroup = new THREE.Group();
scene.add( outerSpiralGroup );

var spiralGroup = new THREE.Group();
outerSpiralGroup.add( spiralGroup )

var spheres = new THREE.Group();
spiralGroup.add( spheres );

var sphereMat = window.mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var sphereGeo = new THREE.SphereBufferGeometry( 0.25 );
var sphere = new THREE.Mesh( sphereGeo, sphereMat.clone() );
spheres.add( sphere );
sphere.visible = false;

// var fib = [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ];
var fib = [ 0, 1 ];
for (var i = 2; i < 10; i++) {
  fib.push( fib[i-1] + fib[i-2] );
}

// counter clockwise
// se, ne, nw, sw
var directions = [ [1,-1], [1,1], [-1,1], [-1,-1] ];

var cpDirections = [ [-1,0], [0,-1], [1,0], [0,1] ];

var fibShape = new THREE.Shape();
fibShape.moveTo( 0, 0 );

for ( var i = 1; i < fib.length; i++ ) {
  var size = fib[i];
  var prevSphere = spheres.children[i-1];
  var dir = directions[i%4];
  var x = prevSphere.position.x + size * dir[0];
  var y = prevSphere.position.y + size * dir[1];
  var sphere = new THREE.Mesh( sphereGeo, sphereMat.clone() );
  sphere.material.color.setHSL( i / fib.length, 1, 0.5 );
  sphere.position.set( x, y, 0 );
  spheres.add( sphere );
  sphere.visible = false;

  var cpDir = cpDirections[i%4];
  var cpX = x + size * cpDir[0];
  var cpY = y + size * cpDir[1];
  fibShape.quadraticCurveTo( cpX, cpY, x, y );
}

var linePoints = fibShape.getPoints();
var lineGeo = new THREE.BufferGeometry().setFromPoints( linePoints );
var lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });
var line = new THREE.Line( lineGeo, lineMat );
spiralGroup.add( line );

var spiralGroup2 = spiralGroup.clone();
spiralGroup2.rotation.z = Math.PI;
outerSpiralGroup.add( spiralGroup2 );

//

window.addEventListener( 'resize', resize, false );

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

loop();

function loop() {
  requestAnimationFrame( loop );
  controls.update();
  outerSpiralGroup.rotation.z -= 0.05;
  renderer.render( scene, camera );
}