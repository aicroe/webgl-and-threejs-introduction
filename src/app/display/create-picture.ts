import {
  Mesh,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
} from 'three';

export function createPicture(
  source: string,
  size = 10,
): Object3D {
  const object = new Object3D();

  new TextureLoader()
    .loadAsync(source)
    .then((texture) => {
      const planeGeometry = new PlaneGeometry(size, size);
      const planeMaterial = new MeshLambertMaterial({
        map: texture,
      });

      const plane = new Mesh(planeGeometry, planeMaterial);
      plane.scale.set(1, texture.image.height / texture.image.width, 1);

      object.add(plane);
    });

  return object;
}
