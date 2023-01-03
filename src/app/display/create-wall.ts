import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  RepeatWrapping,
  TextureLoader,
} from 'three';

function unitsToPixels(units: number): number {
  // Simple heuristic, not standard and use only within this file.
  return units * 50;
}

export function createWall(
  width: number,
  height: number,
  depth = 1,
): Object3D {
  const object = new Object3D();

  new TextureLoader().loadAsync('assets/cinder-block-wall.png').then(
    (texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;

      const wallGeometry = new BoxGeometry(width, height, depth);
      const wallMaterial = new MeshLambertMaterial({
        map: texture,
      });

      const wall = new Mesh(wallGeometry, wallMaterial);

      const textureWidth: number = texture.image.width;
      const textureHeight: number = texture.image.height;
      const wallWidth = unitsToPixels(width);
      const wallHeight = unitsToPixels(height);
      texture.repeat.set(
        wallWidth / textureWidth,
        wallHeight / textureHeight,
      );

      object.add(wall);
    },
  );

  return object;
}
