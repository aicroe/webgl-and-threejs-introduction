import { Group, Object3D } from 'three';
import { Updatable, UpdateParams } from 'app/common';
import { createClassroom } from './create-classroom';
import { createPicture } from './create-picture';
import { createWall } from './create-wall';
import { createGrassFloor } from './create-grass-floor';
import { FocusPoint } from './focus-point';
import { QuickSlider } from './quick-slider';
import { QuickSliderNode } from './quick-slider-node';
import { QuickSliderFocusPoint } from './quick-slider-focus-point';
import { SimpleProgramSample } from './simple-program-sample';

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

  const surroundings = createClassroomSurroundings()
    .translateY(-10);

  return { classroom, surroundings };
}

function createBlackboardSlide(name: string): Object3D {
  return createPicture(`assets/slides/${name}.png`, 13.5);
}

function createShadersCodeSlide(): Object3D {
  const object = new Object3D();
  const vertexShader = createPicture('assets/code-snippets/vertex-shader.png', 8)
    .translateX(-4.5);
  const fragmentShader = createPicture('assets/code-snippets/fragment-shader.png', 8)
    .translateX(4.5);

  object.add(vertexShader, fragmentShader);

  return object;
}

export class DisplayClassroom extends Object3D implements Updatable {
  private updatableObjects: Updatable[];

  constructor() {
    super();
    this.updatableObjects = [];

    const { classroom, surroundings } = createClassroomScene();
    this.add(classroom, surroundings);
  }

  buildFocusPoints(): { start: FocusPoint, end: FocusPoint } {
    const firstSeatObserver = new Object3D()
      .translateY(-3)
      .translateZ(35);
    const lastSeatObserver = new Object3D()
      .translateY(-3)
      .translateZ(60);

    const blackboardContainer = new Object3D()
      .translateX(-0.5)
      .translateY(-1.15)
      .translateZ(13);
    const blackboardFeaturedContainer = new Object3D()
      .translateX(-0.5)
      .translateY(-2)
      .translateZ(15);
    const blackboardCloseObserver = new Object3D()
      .translateZ(7.75);
    const blackboardAwayObserver = new Object3D()
      .translateY(-1)
      .translateZ(12);

    blackboardContainer.add(
      blackboardCloseObserver,
      blackboardAwayObserver,
    );
    this.add(
      firstSeatObserver,
      lastSeatObserver,
      blackboardContainer,
      blackboardFeaturedContainer,
    );

    const webglIntroBlackboard = new QuickSlider([
      new QuickSliderNode(createBlackboardSlide('slide-1')),
      new QuickSliderNode(createBlackboardSlide('slide-2')),
      new QuickSliderNode(createBlackboardSlide('slide-3')),
      new QuickSliderNode(createBlackboardSlide('slide-4')),
    ]);
    blackboardContainer.add(webglIntroBlackboard);

    const graphicsPipelineSlider = new QuickSlider([
      new QuickSliderNode(createPicture('assets/infograms/graphics-pipeline.png', 9)),
    ]);
    blackboardFeaturedContainer.add(graphicsPipelineSlider);

    const shadersAndThreejsIntroBlackboard = new QuickSlider([
      new QuickSliderNode(createBlackboardSlide('slide-5')),
      new QuickSliderNode(createShadersCodeSlide()),
      new QuickSliderNode(createBlackboardSlide('slide-6')),
      new QuickSliderNode(createBlackboardSlide('slide-7')),
    ]);
    blackboardContainer.add(shadersAndThreejsIntroBlackboard);

    const simpleProgramSample = new SimpleProgramSample();
    const threejsProgramSlider = new QuickSlider([
      new QuickSliderNode(createPicture('assets/code-snippets/simple-threejs-program.png', 10)),
      new QuickSliderNode(simpleProgramSample),
    ]);
    blackboardFeaturedContainer.add(threejsProgramSlider);

    const firstSeatFocusPoint = new FocusPoint(
      blackboardContainer,
      firstSeatObserver,
    );
    const webglIntroFocusPoint = new QuickSliderFocusPoint(
      webglIntroBlackboard,
      blackboardCloseObserver,
    );
    const graphicsPipelineFocusPoint = new QuickSliderFocusPoint(
      graphicsPipelineSlider,
      blackboardAwayObserver,
    );
    const shadersAndThreejsIntroFocusPoint = new QuickSliderFocusPoint(
      shadersAndThreejsIntroBlackboard,
      blackboardCloseObserver,
    );
    const threejsProgramFocusPoint = new QuickSliderFocusPoint(
      threejsProgramSlider,
      blackboardAwayObserver,
    );
    const lastSeatFocusPoint = new FocusPoint(
      blackboardContainer,
      lastSeatObserver,
    );

    firstSeatFocusPoint.setNext(webglIntroFocusPoint);
    webglIntroFocusPoint.setNext(graphicsPipelineFocusPoint);
    graphicsPipelineFocusPoint.setNext(shadersAndThreejsIntroFocusPoint);
    shadersAndThreejsIntroFocusPoint.setNext(threejsProgramFocusPoint);
    threejsProgramFocusPoint.setNext(lastSeatFocusPoint);

    this.updatableObjects.push(
      webglIntroBlackboard,
      graphicsPipelineSlider,
      shadersAndThreejsIntroBlackboard,
      threejsProgramSlider,
      simpleProgramSample,
    );

    return {
      start: firstSeatFocusPoint,
      end: lastSeatFocusPoint,
    };
  }

  update(params: UpdateParams): void {
    this.updatableObjects.forEach((updatable) => {
      updatable.update(params);
    });
  }
}
