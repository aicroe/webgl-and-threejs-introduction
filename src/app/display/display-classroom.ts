import { Object3D } from 'three';
import { setPosition } from 'app/common';
import { createClassroom } from './create-classroom';
import { createPicture } from './create-picture';
import { PicturesSlider } from './pictures-slider';

export class DisplayClassroom extends Object3D {
  private blackboardSlider: PicturesSlider;

  constructor() {
    super();

    const classroom = createClassroom();
    this.blackboardSlider = new PicturesSlider([
      createPicture('assets/graphics-pipeline/vertex-shader.png'),
      createPicture('assets/graphics-pipeline/shape-assembly.png'),
      createPicture('assets/graphics-pipeline/rasterization.png'),
      createPicture('assets/graphics-pipeline/fragment-shader.png'),
      createPicture('assets/graphics-pipeline/testing-and-blending.png'),
    ]);
    // Note: Ideal dimension for a blackboard picture is <w: 18, h: 7.5>
    setPosition(this.blackboardSlider, { z: -30.25, y: 7.25 });

    this.add(classroom);
    this.add(this.blackboardSlider);
  }

  next(): void {
    this.blackboardSlider.next();
  }

  previous(): void {
    this.blackboardSlider.previous();
  }

  update(): void {
    this.blackboardSlider.update();
  }
}
