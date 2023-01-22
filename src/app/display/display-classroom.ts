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

  const blackboard = new QuickSlider([
    new QuickSliderNode(createPicture('assets/slides/slide-1.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-2.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-3.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-4.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-5.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-6.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-7.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-8.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-9.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-10.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-11.png', 13.5)),
    new QuickSliderNode(createPicture('assets/slides/slide-12.png', 13.5)),
  ])
    .translateX(-0.5)
    .translateY(8.85)
    .translateZ(-30.25);

  blackboard.name = 'BLACKBOARD_SLIDER';
  classroom.add(blackboard);

  return { classroom, surroundings };
}

class BlackboardFocusPoint extends FocusPoint {
  constructor(
    private blackboard: QuickSlider,
    observer: Object3D,
  ) {
    super(blackboard, observer);
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

  getFocusPoints(): { start: FocusPoint, end: FocusPoint } {
    const startObserver = new Object3D()
      .translateY(-3)
      .translateZ(35);
    this.add(startObserver);
    const startFocusPoint = new FocusPoint(this.blackboard, startObserver);

    const blackboardObserver = new Object3D()
      .translateZ(7.75);
    this.blackboard.add(blackboardObserver);
    const blackboardFocusPoint = new BlackboardFocusPoint(this.blackboard, blackboardObserver);

    const endObserver = new Object3D()
      .translateY(-3)
      .translateZ(60);
    this.add(endObserver);
    const endFocusPoint = new FocusPoint(this.blackboard, endObserver);

    startFocusPoint.setNext(blackboardFocusPoint);
    blackboardFocusPoint.setNext(endFocusPoint);

    return {
      start: startFocusPoint,
      end: endFocusPoint,
    };
  }

  update(): void {
    this.blackboard.update();
  }
}
