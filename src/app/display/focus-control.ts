import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Updatable } from 'app/common';
import { FocusPoint } from './focus-point';

export class FocusControl implements Updatable {
  private updating = false;
  private activePoint: FocusPoint | undefined;

  constructor(
    private camera: Camera,
    private orbitControls: OrbitControls,
    private readonly updateFactor = 0.025,
    private readonly distanceTolerance = 0.001,
  ) {}

  start(startPoint: FocusPoint): void {
    this.changeFocusedPoint(startPoint);
  }

  next(): void {
    const nextPoint = this.activePoint?.getNext();
    if (!nextPoint) {
      return;
    }

    this.changeFocusedPoint(nextPoint);
  }

  previous(): void {
    const previousPoint = this.activePoint?.getPrevious();
    if (!previousPoint) {
      return;
    }

    this.changeFocusedPoint(previousPoint);
  }

  update(): void {
    if (!this.updating || !this.activePoint) {
      return;
    }

    this.camera.position.lerp(
      this.activePoint.getObserverWorldPosition(),
      this.updateFactor,
    );
    this.camera.quaternion.slerp(
      this.activePoint.getObserverWorldQuaternion(),
      this.updateFactor,
    );

    if (this.hasCameraReachedPoint(this.camera, this.activePoint)) {
      this.updating = false;
      this.orbitControls.target.copy(this.activePoint.getTargetWorldPosition());
      this.orbitControls.update();
    }
  }

  private changeFocusedPoint(point: FocusPoint): void {
    point.configureObserverQuaternion();

    this.activePoint = point;
    this.updating = true;
  }

  private hasCameraReachedPoint(camera: Camera, current: FocusPoint): boolean {
    const distance = camera.position.distanceToSquared(current.getObserverWorldPosition());
    return distance <= this.distanceTolerance;
  }
}
