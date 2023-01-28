import { Object3D, Quaternion, Vector3 } from 'three';
import {
  getWorldPositionFactory,
  getWorldQuaternionFactory,
  lookAt,
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

  getTargetWorldPosition = getWorldPositionFactory(this.target, new Vector3());

  getObserverWorldPosition = getWorldPositionFactory(this.observer, new Vector3());

  getObserverWorldQuaternion = getWorldQuaternionFactory(this.observer, new Quaternion());

  configureObserverQuaternion(): void {
    const targetPosition = this.getTargetWorldPosition();
    lookAt(this.observer, targetPosition);
  }
}
