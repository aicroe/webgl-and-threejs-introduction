import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Display {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private orbitControls?: OrbitControls;

  constructor(private container: HTMLElement) {
    const fov = 75;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, this.getAspectRatio(), near, far);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.scene = new THREE.Scene();

    this.container.appendChild(this.renderer.domElement);
  }

  bootstrapScene(): void {
    this.camera.position.z = 3;

    const ambientLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-1, 2, 4);
    this.scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const purpleMaterial = new THREE.MeshPhongMaterial({ color: 0x8844aa });
    const yellowMaterial = new THREE.MeshPhongMaterial({ color: 0xaa8844 });
    const centerCube = new THREE.Mesh(geometry, greenMaterial);
    const leftCube = new THREE.Mesh(geometry, purpleMaterial);
    const rightCube = new THREE.Mesh(geometry, yellowMaterial);

    leftCube.position.x = -2;
    rightCube.position.x = 2;

    this.scene.add(centerCube);
    this.scene.add(leftCube);
    this.scene.add(rightCube);
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
    const timeFactor = time * 0.001;
    const cubes = this.scene.children.filter(object => object instanceof THREE.Mesh) as THREE.Mesh[];
    cubes.forEach((cube, cubeIndex) => {
      const speed = 1 + cubeIndex * .1;
      const rotation = timeFactor * speed;
      cube.rotation.x = rotation;
      cube.rotation.y = rotation;
    });

    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }
}
