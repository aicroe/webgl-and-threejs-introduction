import {
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class RenderingPipelinePost extends Object3D {
  constructor(source: string) {
    super();

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

      this.add(column.scene);
      this.add(plane);
    });
  }
}
