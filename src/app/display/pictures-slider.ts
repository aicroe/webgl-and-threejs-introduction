import { Object3D, Vector3 } from 'three';

class SliderMotion {
  constructor(
    private object: Object3D,
    private target: Vector3,
    private updateFactor: number,
    private distanceTolerance: number,
  ) {}

  update(): void {
    if (this.isComplete()) {
      return;
    }

    this.object.position.lerp(
      this.target,
      this.updateFactor,
    );
  }

  isComplete(): boolean {
    const distance = this.object.position.distanceToSquared(this.target);
    return distance <= this.distanceTolerance;
  }
}

export class PicturesSlider extends Object3D {
  private active: number | null;
  private left: Vector3;
  private right: Vector3;
  private center: Vector3;
  private motionList: SliderMotion[];

  constructor(
    private pictures: Object3D[],
    private distance = 40,
    private readonly updateFactor = 0.25,
    private readonly distanceTolerance = 0.001,
  ) {
    super();
    this.left = new Vector3(-this.distance, 0, 0);
    this.right = new Vector3(this.distance, 0, 0);
    this.center = new Vector3(0, 0, 0);
    this.active = null;

    this.motionList = [];
    this.pictures.forEach((picture) => {
      picture.visible = false;
      picture.position.copy(this.left);
      this.add(picture);
    });
  }

  next(): void {
    if (this.pictures.length === 0 ||
      this.active === this.pictures.length) {
      return;
    }

    this.hideAllPictures();
    if (this.active === null) {
      this.motionList = [
        this.createMotion(0, this.center),
      ];
      this.active = 0;
    } else if (this.isTherePicture(this.active + 1)) {
      this.motionList = [
        this.createMotion(this.active, this.right),
        this.createMotion(this.active + 1, this.center),
      ];
      this.active = this.active + 1;
    } else {
      this.motionList = [
        this.createMotion(this.active, this.right),
      ];
      this.active = this.pictures.length;
    }
  }

  previous(): void {
    if (this.pictures.length === 0 ||
      this.active === null) {
      return;
    }

    this.hideAllPictures();
    if (this.active === this.pictures.length) {
      this.motionList = [
        this.createMotion(this.pictures.length - 1, this.center),
      ];
      this.active = this.pictures.length - 1;
    } else if (this.isTherePicture(this.active - 1)) {
      this.motionList = [
        this.createMotion(this.active, this.left),
        this.createMotion(this.active - 1, this.center),
      ];
      this.active = this.active - 1;
    } else {
      this.motionList = [
        this.createMotion(this.active, this.left),
      ];
      this.active = null;
    }
  }

  update(): void {
    this.motionList.forEach((motion) => motion.update());
  }

  private isTherePicture(pictureIndex: number): boolean {
    return pictureIndex >= 0 && pictureIndex < this.pictures.length;
  }

  private createMotion(pictureIndex: number, target: Vector3): SliderMotion {
    const picture = this.pictures[pictureIndex];
    picture.visible = true;
    return new SliderMotion(
      picture,
      target,
      this.updateFactor,
      this.distanceTolerance,
    );
  }

  private hideAllPictures(): void {
    this.pictures.forEach((picture) => {
      picture.visible = false;
    });
  }
}
