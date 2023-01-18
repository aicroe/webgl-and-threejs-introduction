import { Group, Object3D } from 'three';
import { Updatable } from 'app/common';
import { createClassroom } from './create-classroom';
import { createPicture } from './create-picture';
import { createWall } from './create-wall';
import { createGrassFloor } from './create-grass-floor';
import { FocusPoint } from './focus-point';
import { QuickSlider } from './quick-slider';
import { QuickSliderNode } from './quick-slider-node';

function createClassroomSurroundings(): Object3D {
  const group = new Group();

  const rearWall = createWall(140, 16.5)
    .translateY(8.25)
    .translateZ(-50);

  const leftWall = createWall(100, 16.5)
    .translateX(-70)
    .translateY(8.25)
    .rotateY(Math.PI / 2);

  const rightWall = createWall(100, 16.5)
    .translateX(70)
    .translateY(8.25)
    .rotateY(Math.PI / 2);

  const frontLeftWall = createWall(50, 16.5)
    .translateX(-45)
    .translateY(8.25)
    .translateZ(50);

  const frontRightWall = createWall(50, 16.5)
    .translateX(45)
    .translateY(8.25)
    .translateZ(50);

  const floor = createGrassFloor(140, 100);

  group.add(floor);
  group.add(rearWall);
  group.add(leftWall);
  group.add(rightWall);
  group.add(frontLeftWall);
  group.add(frontRightWall);

  return group;
}

function createClassroomScene(): {
  classroom: Object3D,
  surroundings: Object3D,
} {
  const classroom = createClassroom()
    .translateY(-10)
    .translateZ(43);

  const surroundings = createClassroomSurroundings().translateY(-10);

  // Note: Ideal dimension for a blackboard picture is <w: 18, h: 7.5>
  const blackboard = new QuickSlider([
    new QuickSliderNode(createPicture('assets/graphics-pipeline/vertex-shader.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/shape-assembly.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/rasterization.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/fragment-shader.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/testing-and-blending.png')),
  ])
    .translateY(7.25)
    .translateZ(-30.25);

  blackboard.name = 'BLACKBOARD_SLIDER';
  classroom.add(blackboard);

  return { classroom, surroundings };
}

class CustomFocusPoint extends FocusPoint {
  constructor(
    private blackboard: QuickSlider,
    target: Object3D,
    observer: Object3D,
  ) {
    super(target, observer);
  }

  override getNext(): FocusPoint | null {
    if (this.blackboard.hasNext()) {
      this.blackboard.next();
      return this;
    }

    return super.getNext();
  }

  override getPrevious(): FocusPoint | null {
    if (this.blackboard.hasPrevious()) {
      this.blackboard.previous();
      return this;
    }

    return super.getPrevious();
  }
}

export class DisplayClassroom extends Object3D implements Updatable {
  private blackboard: QuickSlider;

  constructor() {
    super();
    const { classroom, surroundings } = createClassroomScene();

    this.blackboard = classroom.getObjectByName('BLACKBOARD_SLIDER') as QuickSlider;
    this.add(classroom);
    this.add(surroundings);
  }

  getFocusPoint(observer: Object3D): FocusPoint {
    return new CustomFocusPoint(this.blackboard, this, observer);
  }

  update(): void {
    this.blackboard.update();
  }
}
