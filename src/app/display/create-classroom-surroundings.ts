import { Group } from 'three';
import { createWall } from './create-wall';
import { createGrassFloor } from './create-grass-floor';

export function createClassroomSurroundings(): Group {
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
