import { Object3D } from 'three';
import { connectNodes, Updatable, UpdateParams } from 'app/common';
import { createClassroom } from './create-classroom';
import { createClassroomSurroundings } from './create-classroom-surroundings';
import { createPicture } from './create-picture';
import { FocusPoint } from './focus-point';
import { LightHandle } from './light-handle';
import { MeshesAndLightsSample } from './meshes-and-lights-sample';
import { PagedFocusPoint } from './paged-focus-point';
import { QuickSlider } from './quick-slider';
import { QuickSliderNode } from './quick-slider-node';
import { SimpleProgramSample } from './simple-program-sample';

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

function createPagedFocusPoint(
  pages: QuickSlider,
  observer: Object3D,
): FocusPoint {
  return new PagedFocusPoint(pages, pages, observer);
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
    classroom.name = '$classroom';
  }

  buildFocusPoints(lights: LightHandle[]): { start: FocusPoint, end: FocusPoint } {
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
    const samplesContainer = new Object3D()
      .translateY(-6)
      .translateZ(19.5);
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
      samplesContainer,
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

    const meshesAndLightsBlackboard = new QuickSlider([
      new QuickSliderNode(createBlackboardSlide('slide-8')),
      new QuickSliderNode(createBlackboardSlide('slide-9')),
      new QuickSliderNode(createBlackboardSlide('slide-10')),
    ]);
    blackboardContainer.add(meshesAndLightsBlackboard);

    const meshesAndLightsSample = new MeshesAndLightsSample([
      ...lights,
      this.getObjectByName('$classroom')?.userData['lightHandle'],
    ]);
    samplesContainer.add(meshesAndLightsSample.getObject());

    const camerasAndAnimationBlackboard = new QuickSlider([
      new QuickSliderNode(createBlackboardSlide('slide-11')),
      new QuickSliderNode(createPicture('assets/infograms/cameras.png', 15)),
      new QuickSliderNode(createBlackboardSlide('slide-12')),
    ]);
    blackboardContainer.add(camerasAndAnimationBlackboard);

    const firstSeatFocusPoint = new FocusPoint(
      blackboardContainer,
      firstSeatObserver,
    );
    const webglIntroFocusPoint = createPagedFocusPoint(
      webglIntroBlackboard,
      blackboardCloseObserver,
    );
    const graphicsPipelineFocusPoint = createPagedFocusPoint(
      graphicsPipelineSlider,
      blackboardAwayObserver,
    );
    const shadersAndThreejsIntroFocusPoint = createPagedFocusPoint(
      shadersAndThreejsIntroBlackboard,
      blackboardCloseObserver,
    );
    const threejsProgramFocusPoint = createPagedFocusPoint(
      threejsProgramSlider,
      blackboardAwayObserver,
    );
    const meshesAndLightsFocusPoint = createPagedFocusPoint(
      meshesAndLightsBlackboard,
      blackboardCloseObserver,
    );
    const meshesAndLightsSampleFocusPoint = new PagedFocusPoint(
      meshesAndLightsSample,
      meshesAndLightsSample.getObject(),
      firstSeatObserver,
    );
    const camerasAndAnimationFocusPoint = createPagedFocusPoint(
      camerasAndAnimationBlackboard,
      blackboardCloseObserver,
    );
    const lastSeatFocusPoint = new FocusPoint(
      blackboardContainer,
      lastSeatObserver,
    );

    connectNodes(
      firstSeatFocusPoint,
      webglIntroFocusPoint,
      graphicsPipelineFocusPoint,
      shadersAndThreejsIntroFocusPoint,
      threejsProgramFocusPoint,
      meshesAndLightsFocusPoint,
      meshesAndLightsSampleFocusPoint,
      camerasAndAnimationFocusPoint,
      lastSeatFocusPoint,
    );

    this.updatableObjects.push(
      webglIntroBlackboard,
      graphicsPipelineSlider,
      shadersAndThreejsIntroBlackboard,
      threejsProgramSlider,
      simpleProgramSample,
      meshesAndLightsBlackboard,
      camerasAndAnimationBlackboard,
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
