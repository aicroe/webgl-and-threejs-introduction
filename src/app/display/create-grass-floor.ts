import {
  Mesh,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  RepeatWrapping,
  TextureLoader,
} from 'three';

function unitsToPixels(units: number): number {
  // Simple heuristic, not standard and use only within this file.
  return units * 10;
}

export function createGrassFloor(
  width: number,
  height: number,
): Object3D {
  const object = new Object3D();

  new TextureLoader().loadAsync('assets/textures/grass.png').then(
    (texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;

      const floorGeometry = new PlaneGeometry(width, height);
      const floorMaterial = new MeshLambertMaterial({
        map: texture,
      });

      const floor = new Mesh(floorGeometry, floorMaterial);
      floor.rotateX(-Math.PI / 2);

      const textureWidth: number = texture.image.width;
      const textureHeight: number = texture.image.height;
      const wallWidth = unitsToPixels(width);
      const wallHeight = unitsToPixels(height);
      texture.repeat.set(
        wallWidth / textureWidth,
        wallHeight / textureHeight,
      );

      object.add(floor);
    },
  );

  return object;
}
