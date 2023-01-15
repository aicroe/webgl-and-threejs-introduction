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

  constructor(private container: HTMLElement) {
    const fov = 75;
    const near = 0.1;
    const far = 1000;
    this.camera = new PerspectiveCamera(fov, this.getAspectRatio(), near, far);

    this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.scene = new Scene();

    this.container.appendChild(this.renderer.domElement);
  }

  bootstrapScene(): void {
    this.camera.position.z = 5;

    const ambientLight = new HemisphereLight(0xffffbb, 0x080820, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(-1, 1, 2);
    this.scene.add(this.directionalLight)

    const classroom = new FocusPoint(
      new DisplayClassroom(),
      new Object3D().translateZ(35).translateY(-3),
    );
    classroom.rotateY(-Math.PI  / 2);
    classroom.position.set(200, 0, 0);

    const title = new FocusPoint(
      createTitle('WebGL and THREE.js \n       Introduction'),
      new Object3D().translateZ(20),
    );
    title.position.set(0, 0, -15);

    title.setNextPoint(classroom);

    this.focusControl = new FocusControl(this.camera);
    this.focusControl.setCurrentFocusPoint(title);

    this.scene.add(title);
    this.scene.add(classroom);
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

  update(): void {
    this.focusControl?.update();
  }

  render(time: number): void {
    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }
}
