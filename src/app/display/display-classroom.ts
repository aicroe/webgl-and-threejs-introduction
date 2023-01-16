import { Group, Object3D } from 'three';
import { setPosition, Updatable } from 'app/common';
import { createClassroom } from './create-classroom';
import { createPicture } from './create-picture';
import { createWall } from './create-wall';
import { createGrassFloor } from './create-grass-floor';
import { FocusPoint } from './focus-point';
import { QuickSlider } from './quick-slider';
import { QuickSliderNode } from './quick-slider-node';

function createClassroomSurroundings(): Object3D {
  const group = new Group();

  const rearWall = setPosition(
    createWall(140, 16.5),
    { z: -50, y: 8.25 },
  );

  const leftWall = setPosition(
    createWall(100, 16.5),
    { x: -70, y: 8.25 },
  );
  leftWall.rotateY(Math.PI / 2);

  const rightWall = setPosition(
    createWall(100, 16.5),
    { x: 70, y: 8.25 },
  );
  rightWall.rotateY(Math.PI / 2);

  const frontLeftWall = setPosition(
    createWall(50, 16.5),
    { x: -45, y: 8.25, z: 50 },
  );

  const frontRightWall = setPosition(
    createWall(50, 16.5),
    { x: 45, y: 8.25, z: 50 },
  );

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
  const classroom = createClassroom();
  const blackboard = new QuickSlider([
    new QuickSliderNode(createPicture('assets/graphics-pipeline/vertex-shader.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/shape-assembly.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/rasterization.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/fragment-shader.png')),
    new QuickSliderNode(createPicture('assets/graphics-pipeline/testing-and-blending.png')),
  ]);
  blackboard.name = 'BLACKBOARD_SLIDER';

  // Note: Ideal dimension for a blackboard picture is <w: 18, h: 7.5>
  setPosition(blackboard, { z: -30.25, y: 7.25 });

  classroom.add(blackboard);
  setPosition(classroom, { z: 43, y: -10 });

  const surroundings = createClassroomSurroundings();
  setPosition(surroundings, { y: -10 });

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
