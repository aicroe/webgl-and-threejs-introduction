import { Object3D } from 'three';

export type Position3D = { x?: number; y?: number; z?: number; };

export function setPosition(object: Object3D, { x, y, z }: Position3D): Object3D {
  const position = object.position;
  position.x = x ?? position.x;
  position.y = y ?? position.y;
  position.z = z ?? position.z;

  return object;
}
