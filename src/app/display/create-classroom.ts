import { Object3D, PointLight } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function createClassroom(): Object3D {
  const object = new Object3D();

  new GLTFLoader()
    .loadAsync('assets/classroom.glb')
    .then((classroom) => {
      const lightColor = 0xffffff;
      const lightIntensity = 0.8;
      const lightDistance = 100;
      const light = new PointLight(lightColor, lightIntensity, lightDistance)
        .translateX(15)
        .translateY(12);

      const scene = classroom.scene
        .translateY(1.3)
        .rotateY(Math.PI / 2);

      object.add(scene);
      object.add(light);
    });

  return object;
}
