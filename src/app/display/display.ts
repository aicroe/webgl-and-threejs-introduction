import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Updatable, UpdateParams } from 'app/common';
import { DisplayClassroom } from './display-classroom';
import { FocusControl } from './focus-control';
import { FocusPoint } from './focus-point';
import { FloatingTitle } from './floating-title';
import { LightHandle } from './light-handle';

export class Display {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private directionalLight?: DirectionalLight;
  private orbitControls?: OrbitControls;
  private focusControl?: FocusControl;
  private updatableObjects: Updatable[];

  constructor(private container: HTMLElement) {
    const fov = 75;
    const near = 0.1;
    const far = 1000;
    this.camera = new PerspectiveCamera(fov, this.getAspectRatio(), near, far);

    this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.scene = new Scene();
    this.updatableObjects = [];

    this.container.appendChild(this.renderer.domElement);
  }

  bootstrapScene(): void {
    this.camera.position.z = 5;

    const ambientLight = new HemisphereLight(0xffffbb, 0x080820, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 0.25);
    this.directionalLight.position.set(-1, 1, 2);
    this.scene.add(this.directionalLight);

    const welcomeTitle = new FloatingTitle(
      'WebGL and THREE.js \n       Introduction',
      0x003b41,
    )
      .translateZ(-50);
    const welcomeTitleObserver = new Object3D()
      .translateZ(20);
    welcomeTitle.add(welcomeTitleObserver);

    const classroom = new DisplayClassroom()
      .translateX(200)
      .rotateY(-Math.PI / 2);

    const thanksTitle = new FloatingTitle('Thanks!', 0xff9e0a)
      .translateZ(50)
      .rotateY(Math.PI);
    const thanksTitleObserver = new Object3D()
      .translateZ(20);
    thanksTitle.add(thanksTitleObserver);

    const welcomeFocusPoint = new FocusPoint(welcomeTitle, welcomeTitleObserver);
    const {
      start: classroomStartFocusPoint,
      end: classroomEndFocusPoint,
    } = classroom.buildFocusPoints([new LightHandle(ambientLight)]);
    const thanksFocusPoint = new FocusPoint(thanksTitle, thanksTitleObserver);
    welcomeFocusPoint.setNext(classroomStartFocusPoint);
    classroomEndFocusPoint.setNext(thanksFocusPoint);

    this.scene.add(welcomeTitle, classroom, thanksTitle);
    this.updatableObjects.push(welcomeTitle, classroom, thanksTitle);

    this.focusControl = new FocusControl(this.camera);
    this.focusControl.start(welcomeFocusPoint);
  }

  addHelpers(): void {
    const cameraHelper = new CameraHelper(this.camera);
    this.scene.add(cameraHelper);

    if (this.directionalLight) {
      const directionalLightHelper = new DirectionalLightHelper(
        this.directionalLight,
        undefined,
        0xff0000,
      );
      this.scene.add(directionalLightHelper);
    }

    (globalThis as any).display = this;
  }

  setUpOrbitControls(): void {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
  }

  next(): void {
    this.focusControl?.next();
  }

  previous(): void {
    this.focusControl?.previous();
  }

  resize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
  }

  update(params: UpdateParams): void {
    this.focusControl?.update();
    this.updatableObjects.forEach((each) => each.update(params));
  }

  render(_params: UpdateParams): void {
    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }
}
