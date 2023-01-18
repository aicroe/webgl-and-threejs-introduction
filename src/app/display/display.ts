import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  Object3D,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Updatable } from 'app/common';
import { createTitle } from './create-title';
import { DisplayClassroom } from './display-classroom';
import { FocusControl } from './focus-control';
import { FocusPoint } from './focus-point';

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
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.scene = new Scene();
    this.updatableObjects = [];

    this.container.appendChild(this.renderer.domElement);
  }

  bootstrapScene(): void {
    this.camera.position.z = 5;

    const ambientLight = new HemisphereLight(0xffffbb, 0x080820, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(-1, 1, 2);
    this.scene.add(this.directionalLight);

    const title = createTitle('WebGL and THREE.js \n       Introduction')
      .translateZ(-15);
    const titleObserver = new Object3D()
      .translateZ(20);
    title.add(titleObserver);

    const classroom = new DisplayClassroom()
      .translateX(200)
      .rotateY(-Math.PI  / 2);
    const classroomObserver = new Object3D()
      .translateZ(35)
      .translateY(-3);
    classroom.add(classroomObserver);

    const titleFocusPoint = new FocusPoint(title, titleObserver);
    const classroomFocusPoint = classroom.getFocusPoint(classroomObserver);
    titleFocusPoint.setNext(classroomFocusPoint);
    this.focusControl = new FocusControl(this.camera, titleFocusPoint);

    this.scene.add(title);
    this.scene.add(classroom);

    this.updatableObjects.push(classroom);
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

  update(timestamp: number): void {
    this.focusControl?.update();
    this.updatableObjects.forEach((each) => each.update(timestamp));
  }

  render(_timestamp: number): void {
    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }
}
