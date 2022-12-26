import { Camera } from 'three';
import { FocusPoint } from './focus-point';

export class FocusControl {
  private points: FocusPoint[] = [];
  private active: number | undefined;
  private updating = false;

  constructor(
    private camera: Camera,
    private readonly updateFactor = 0.025,
    private readonly distanceTolerance = 0.001,
  ) {}

  addPoint(point: FocusPoint): void {
    this.points.push(point);
  }

  next(): void {
    if (this.points.length === 0) {
      return;
    }

    const nextPoint = this.active === undefined ? 0 : this.active + 1;
    this.changeFocusedPoint(nextPoint);
  }

  previous(): void {
    if (this.points.length === 0) {
      return;
    }

    const previousPoint = this.active === undefined ?
      -1 :
      this.active - 1;
    this.changeFocusedPoint(previousPoint);
  }

  update(): void {
    if (!this.updating || this.active === undefined) {
      return;
    }

    const current = this.points[this.active];
    this.camera.position.lerp(
      current.getObserverWorldPosition(),
      this.updateFactor,
    );
    this.camera.quaternion.slerp(
      current.getObserverWorldQuaternion(),
      this.updateFactor,
    );

    if (this.hasCameraReachedPoint(this.camera, current)) {
      this.updating = false;
    }
  }

  private changeFocusedPoint(pointIndex: number): void {
    if (pointIndex < 0 || pointIndex >= this.points.length) {
      return;
    }

    const current = this.points[pointIndex];
    current.configureObserverQuaternion();

    this.active = pointIndex;
    this.updating = true;
  }

  private hasCameraReachedPoint(camera: Camera, current: FocusPoint): boolean {
    const distance = camera.position.distanceToSquared(current.getObserverWorldPosition());
    return distance <= this.distanceTolerance;
  }
}
