import { Camera } from 'three';
import { FocusPoint } from './focus-point';

export class FocusControl {
  private current: FocusPoint | null = null;
  private updating = false;

  constructor(
    private camera: Camera,
    private readonly updateFactor = 0.025,
    private readonly distanceTolerance = 0.001,
  ) {}

  setCurrentFocusPoint(point: FocusPoint): void {
    this.current = point;
  }

  next(): void {
    const nextPoint = this.current?.getNextPoint();
    if (!nextPoint) {
      return;
    }

    this.changeFocusedPoint(nextPoint);
  }

  previous(): void {
    const previousPoint = this.current?.getPreviousPoint();
    if (!previousPoint) {
      return;
    }

    this.changeFocusedPoint(previousPoint);
  }

  update(): void {
    if (!this.updating || !this.current) {
      return;
    }

    this.camera.position.lerp(
      this.current.getObserverWorldPosition(),
      this.updateFactor,
    );
    this.camera.quaternion.slerp(
      this.current.getObserverWorldQuaternion(),
      this.updateFactor,
    );

    if (this.hasCameraReachedPoint(this.camera, this.current)) {
      this.updating = false;
    }
  }

  private changeFocusedPoint(point: FocusPoint): void {
    point.configureObserverQuaternion();

    this.current = point;
    this.updating = true;
  }

  private hasCameraReachedPoint(camera: Camera, current: FocusPoint): boolean {
    const distance = camera.position.distanceToSquared(current.getObserverWorldPosition());
    return distance <= this.distanceTolerance;
  }
}
