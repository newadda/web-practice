import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//// 렌더링 큐의 동작이다.
function animate(time) {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();


/// 마우스로 화면 움직임
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


/// x,y,z 좌표 표현
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


/// 격자문양
scene.add(new THREE.GridHelper());

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );


scene.add(geometrySquare());
scene.add(shapeAndExtrudeGeometry());

///// =========== Shape 예제

/// Shape 를 이용한 2차원 사각형
function shapeSquare()
{
  let shape = new THREE.Shape()
  shape.moveTo(1, 1);
  shape.lineTo(1, -1);
  shape.lineTo(-1, -1);
  shape.lineTo(-1, 1);
  shape.closePath();

  let g = new THREE.ShapeGeometry(shape);
  let m = new THREE.MeshLambertMaterial({color: "aqua"});
  let mesh = new THREE.Mesh(g, m);
  return mesh;
}

/// BufferGeometry를 이용한 2차원 사각형
function geometrySquare()
{
    const geometry = new THREE.BufferGeometry();

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2

	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );
/// V0~V2 한면, V3~V5 한면

// itemSize = 3 , 면은 3개의 vertex가 있으야 하므로.
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh( geometry, material );
    return mesh;
}



//// shape와 extrude 를 이용한 3차원 사각형
/// ExtrudeGeometry 의 extrudePath는 시작부터 끝까지의 Extrude 의 경로를 뜻한다.
/// * 때문에 extrudePath는 2개 이상이어야 한다.
/// shape의 면은 extrudePath의 경로의 방향을 고려해서 시작점에 표현이 된다.
/// 때문에 shape를 그릴 때 (0,0)을 중심으로한 면을 만들어야 한다.
function shapeAndExtrudeGeometry()
{
    let shape = new THREE.Shape()
    shape.moveTo(1, 1);
    shape.lineTo(1, -1);
    shape.lineTo(-1, -1);
    shape.lineTo(-1, 1);
    shape.closePath();

    const points = [[0,0,0],[0,0,2],]
    const vector3Path=points.map((_,idx,arr)=>{

        return new THREE.Vector3(
            arr[idx][0],
            arr[idx][1],
            arr[idx][2]
          );
    })

    console.log(vector3Path)
    let curve = new THREE.CatmullRomCurve3(vector3Path);


    const extrudeSettings = {
        steps: 2,
        depth: 16,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1,
        extrudePath : curve,
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    console.log(geometry)

    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const mesh = new THREE.Mesh( geometry, material ) ;
    return mesh;
}