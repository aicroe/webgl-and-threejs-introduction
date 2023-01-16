import { Matrix4, Object3D, Quaternion, Vector3 } from 'three';
import {
  getWorldPositionFactory,
  getWorldQuaternionFactory,
} from 'app/common';

export class FocusPoint {
  private next: FocusPoint | null = null;
  private previous: FocusPoint | null = null;

  constructor(
    private target: Object3D,
    private observer: Object3D,
  ) {}

  getNext(): FocusPoint | null {
    return this.next;
  }

  getPrevious(): FocusPoint | null {
    return this.previous;
  }

  setNext(next: FocusPoint): void {
    this.next = next;
    this.next.previous = this;
  }

  setPrevious(previous: FocusPoint): void {
    this.previous = previous;
    this.previous.next = this;
  }

  getTarget(): Object3D {
    return this.target;
  }

  getTargetWorldPosition = getWorldPositionFactory(this.target, new Vector3());

  getObserver(): Object3D {
    return this.observer;
  }

  getObserverWorldPosition = getWorldPositionFactory(this.observer, new Vector3());

  getObserverWorldQuaternion = getWorldQuaternionFactory(this.observer, new Quaternion());

  configureObserverQuaternion(): void {
    // Set up observer quaternion to point to the target
    // Based on Object3D.lookAt method, but implemented as if the observer was a camera
    // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L260

    const targetPosition = this.getTargetWorldPosition();
    const observerPosition = this.getObserverWorldPosition();

    const rotationMatrix = new Matrix4().lookAt(
      observerPosition,
      targetPosition,
      this.observer.up,
    );
    this.observer.quaternion.setFromRotationMatrix(rotationMatrix);

    if (this.observer.parent) {
      const parentRotationMatrix = new Matrix4().extractRotation(
        this.observer.parent.matrixWorld,
      );
      this.observer.quaternion.premultiply(
        new Quaternion()
          .setFromRotationMatrix(parentRotationMatrix)
          .invert()
      );
    }
  }
}
