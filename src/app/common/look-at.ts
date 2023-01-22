import { Matrix4, Object3D, Quaternion, Vector3 } from 'three';

/**
 * Aim object's quaternion to the target's position.
 * Based on [Object3D.lookAt](https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L264) method,
 * but implemented as if the observer was a camera.
 */
export function lookAt(object: Object3D, target: Vector3): void {
  const position = object.getWorldPosition(new Vector3());

  const rotationMatrix = new Matrix4().lookAt(
    position,
    target,
    object.up,
  );
  object.quaternion.setFromRotationMatrix(rotationMatrix);

  if (object.parent) {
    const parentRotationMatrix = new Matrix4().extractRotation(
      object.parent.matrixWorld,
    );
    object.quaternion.premultiply(
      new Quaternion()
        .setFromRotationMatrix(parentRotationMatrix)
        .invert()
    );
  }
}
