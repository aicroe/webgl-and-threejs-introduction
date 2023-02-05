import {
  BoxGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Shape,
  SphereGeometry,
  TorusGeometry,
} from 'three';

function createBoxSample(): Object3D {
  const geometry = new BoxGeometry(3.5, 3.5, 3.5);
  const material = new MeshLambertMaterial({ color: 0xea794e });

  const mesh = new Mesh(geometry, material)
    .translateX(-10.5);

  return mesh;
}

function createSphereSample(): Object3D {
  const geometry = new SphereGeometry(2.5);
  const material = new MeshLambertMaterial({ color: 0x7795f3 });

  const mesh = new Mesh(geometry, material)
    .translateX(-5);
  return mesh;
}

function createCylinderSample(): Object3D {
  const geometry = new CylinderGeometry(2, 2, 4, 20, 32);
  const material = new MeshLambertMaterial({ color: 0x1d1d35 });

  const mesh = new Mesh(geometry, material);
  return mesh;
}

function createTorusSample(): Object3D {
  const geometry = new TorusGeometry(1.5, 0.8, 16, 100);
  const material = new MeshLambertMaterial({ color: 0x44aa88 });

  const mesh = new Mesh(geometry, material)
    .translateX(5);
  return mesh;
}

function createExtrudeSample(): Object3D {
  const shape = new Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  const extrudeSettings = {
    steps: 2,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  const material = new MeshLambertMaterial({ color: 0xbf9230 });

  const mesh = new Mesh(geometry, material)
    .translateX(10)
    .rotateX(Math.PI);
  mesh.scale.set(0.35, 0.35, 0.35);

  return mesh;
}

export function createGeometriesSample(): Object3D {
  const object = new Object3D();
  object.add(
    createBoxSample(),
    createSphereSample(),
    createCylinderSample(),
    createTorusSample(),
    createExtrudeSample(),
  );

  return object;
}
