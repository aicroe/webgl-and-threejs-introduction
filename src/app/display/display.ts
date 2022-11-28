
import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { setPosition } from 'app/common';
import { createGraphicsPipelineScene } from './create-graphics-pipeline-scene';
import { FocusControl } from './focus-control';

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
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.scene = new Scene();

    this.container.appendChild(this.renderer.domElement);
  }

  bootstrapScene(): void {
    this.camera.position.z = 5;

    const ambientLight = new HemisphereLight(0xffffbb, 0x080820, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 0.7);
    this.directionalLight.position.set(-1, 2, 4);
    this.scene.add(this.directionalLight);

    const {
      scene: graphicsPipelineScene,
      control: focusControl,
    } = createGraphicsPipelineScene(this.camera);

    setTimeout(() => {
      focusControl.next();
    }, 2_000);

    setPosition(graphicsPipelineScene, { z: -5 });
    this.scene.add(graphicsPipelineScene);
    this.focusControl = focusControl;
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
  }

  setUpOrbitControls(): void {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  resize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate = (time: number = 0) => {
    requestAnimationFrame(this.animate);
    this.render(time);
  }

  private render(time: number): void {
    this.renderer.render(this.scene, this.camera);
    this.focusControl?.update();
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }
}
