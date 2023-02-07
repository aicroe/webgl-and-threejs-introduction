import { Mesh, Object3D, PointLight } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { LightHandle } from './light-handle';

export function createClassroom(): Object3D {
  const object = new Object3D();
  const lightHandle = new LightHandle();

  new GLTFLoader()
    .loadAsync('assets/classroom.glb')
    .then((classroom) => {
      const lightColor = 0xffffff;
      const lightIntensity = 0.8;
      const lightDistance = 100;
      const light = new PointLight(lightColor, lightIntensity, lightDistance)
        .translateX(15)
        .translateY(12);
      lightHandle.setLight(light);

      const scene = classroom.scene
        .translateY(1.3)
        .rotateY(Math.PI / 2);

      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.receiveShadow = true;
        }
      });

      object.add(scene);
      object.add(light);
    });

  object.userData['lightHandle'] = lightHandle;

  return object;
}
