
import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DisplayClassroom } from './display-classroom';
import { FocusControl } from './focus-control';

export class Display {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private directionalLight?: DirectionalLight;
  private orbitControls?: OrbitControls;
  private focusControl?: FocusControl;
  private classroom?: DisplayClassroom;

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

    this.classroom = new DisplayClassroom();

    this.scene.add(this.classroom);
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
    this.classroom?.next();
  }

  previous(): void {
    this.classroom?.previous();
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
    this.classroom?.update();
  }

  render(time: number): void {
    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }
}
