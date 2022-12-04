import { Camera } from 'three';
import { FocusPoint } from './focus-point';

export class FocusControl {
  private points: FocusPoint[] = [];
  private activePoint: number | undefined;
  private updating = false;

  private static readonly UPDATE_FACTOR = 0.025;
  private static readonly DISTANCE_TOLERANCE = 0.001;

  constructor(private camera: Camera) {}

  addPoint(point: FocusPoint): void {
    this.points.push(point);
  }

  next(): void {
    if (this.points.length === 0) {
      return;
    }

    const nextPoint = this.activePoint === undefined ? 0 : this.activePoint + 1;
    this.changeFocusedPoint(nextPoint);
  }

  previous(): void {
    if (this.points.length === 0) {
      return;
    }

    const previousPoint = this.activePoint === undefined ? 0 : this.activePoint - 1;
    this.changeFocusedPoint(previousPoint);
  }

  update(): void {
    if (!this.updating || this.activePoint === undefined) {
      return;
    }

    const current = this.points[this.activePoint];
    this.camera.position.lerp(
      current.getObserverWorldPosition(),
      FocusControl.UPDATE_FACTOR,
    );
    this.camera.quaternion.slerp(
      current.getObserverWorldQuaternion(),
      FocusControl.UPDATE_FACTOR,
    );

    if (this.hasCameraReachedPoint(this.camera, current)) {
      this.updating = false;
    }
  }

  private changeFocusedPoint(activePoint: number): void {
    if (activePoint < 0 || activePoint >= this.points.length) {
      return;
    }

    const current = this.points[activePoint];
    current.configureObserverQuaternion();

    this.activePoint = activePoint;
    this.updating = true;
  }

  private hasCameraReachedPoint(camera: Camera, current: FocusPoint): boolean {
    const distance = camera.position.distanceToSquared(current.getObserverWorldPosition());
    return distance <= FocusControl.DISTANCE_TOLERANCE;
  }
}
