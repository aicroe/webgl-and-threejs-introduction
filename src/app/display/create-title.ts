import { Mesh, MeshPhongMaterial, Object3D } from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export function createTitle(text: string): Object3D {
  const object = new Object3D();

  import('three/examples/fonts/droid/droid_sans_regular.typeface.json').then(
    (font) => {
      const titleGeometry = new TextGeometry(text, {
        font: new Font(font),
        size: 4,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.3,
        bevelSegments: 5,
      });
      const titleMaterial = new MeshPhongMaterial({
        color: 0x003b41,
        shininess: 15,
      });
      const title = new Mesh(titleGeometry, titleMaterial);

      object.add(title);
    },
  );

  return object;
}
