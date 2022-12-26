import { Object3D, PointLight } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { setPosition } from 'app/common';

export function createClassroom(): Object3D {
  const object = new Object3D();

  new GLTFLoader()
    .loadAsync('assets/classroom.glb')
    .then((classroom) => {
      const lightColor = 0xffffff;
      const lightIntensity = 1;
      const lightDistance = 100;
      const light = setPosition(
        new PointLight(lightColor, lightIntensity, lightDistance),
        { y: 12, x: 15 },
      );

      object.rotateY(Math.PI / 2);
      object.add(classroom.scene);
      object.add(light);
    });

  return object;
}
