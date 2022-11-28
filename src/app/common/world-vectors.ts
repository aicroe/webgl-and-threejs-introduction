import { Object3D, Quaternion, Vector3 } from 'three';

export function getWorldPositionFactory(
  object: Object3D,
  target: Vector3,
): () => Vector3 {
  return () => {
    return object.getWorldPosition(target);
  }
}

export function getWorldQuaternionFactory(
  object: Object3D,
  target: Quaternion,
): () => Quaternion {
  return () => {
    return object.getWorldQuaternion(target);
  }
}
