import { Group, Object3D } from 'three';
import { setPosition } from 'app/common';
import { createClassroom } from './create-classroom';
import { createPicture } from './create-picture';
import { PicturesSlider } from './pictures-slider';
import { createWall } from './create-wall';
import { createGrassFloor } from './create-grass-floor';

function createClassroomScenery(): Object3D {
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

    classroom.add(this.blackboardSlider);
    setPosition(classroom, { z: 43, y: -10 });

    const scenery = createClassroomScenery();
    setPosition(scenery, { y: -10 });

    this.add(scenery);
    this.add(classroom);
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
