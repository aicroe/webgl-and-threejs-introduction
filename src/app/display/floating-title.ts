import { ColorRepresentation, Mesh, MeshPhongMaterial, Object3D } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Updatable, UpdateParams } from 'app/common';

export class FloatingTitle extends Object3D implements Updatable {
  private titleContainer: Object3D = new Object3D();

  constructor(text: string, color: ColorRepresentation) {
    super();

    this.add(this.titleContainer);

    new FontLoader()
      .loadAsync('three/fonts/droid/droid_sans_regular.typeface.json')
      .then((font) => {
        const titleGeometry = new TextGeometry(text, {
          font,
          size: 4,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.15,
          bevelSize: 0.3,
          bevelSegments: 5,
        });
        const titleMaterial = new MeshPhongMaterial({
          color,
          shininess: 15,
        });
        const title = new Mesh(titleGeometry, titleMaterial);

        title.geometry.computeBoundingBox();
        title.geometry.boundingBox?.getCenter(title.position).multiplyScalar(-1);

        this.titleContainer.add(title);
      });
  }

  update({ timestamp }: UpdateParams): void {
    const speedFactor = 0.001;
    const lengthFactor = 0.1;

    const rotationValue = Math.sin(timestamp * speedFactor) * lengthFactor;
    this.titleContainer.rotation.y = rotationValue;
    this.titleContainer.rotation.z = -rotationValue;
  }
}
