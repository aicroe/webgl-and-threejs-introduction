import {
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function createColumnPanel(source: string): Object3D {
  const object = new Object3D();

  Promise.all([
    new GLTFLoader().loadAsync('assets/small-column.glb'),
    new TextureLoader().loadAsync(source),
  ]).then(([column, picture]) => {
    column.scene.scale.set(0.5, 0.5, 0.5);

    const planeGeometry = new PlaneGeometry(2.5, 2.5);
    const planeMaterial = new MeshLambertMaterial({
      map: picture,
      side: DoubleSide,
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.position.y = 3;
    plane.rotateX(-Math.PI / 12)

    object.add(column.scene);
    object.add(plane);
  });

  return object;
}
