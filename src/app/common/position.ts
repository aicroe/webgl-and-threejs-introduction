import { Object3D } from 'three';

export type Position3D = { x?: number; y?: number; z?: number; };

export function setPosition<T extends Object3D>(
  object: T,
  { x, y, z }: Position3D,
): T {
  const position = object.position;
  position.x = x ?? position.x;
  position.y = y ?? position.y;
  position.z = z ?? position.z;

  return object;
}
