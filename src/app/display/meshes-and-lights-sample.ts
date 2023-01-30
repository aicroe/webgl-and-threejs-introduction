import {
  BoxGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Shape,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import { Updatable, UpdateParams } from 'app/common';
import { Pages } from './pages';
import { EmptySamplePage, SamplePage } from './sample-page';
import { LightHandle } from './light-handle';

class SetupPage extends SamplePage {
  constructor(private container: Object3D, private allLights: LightHandle[]) {
    super();

    this.container.visible = false;

    {
      // Sample: Box and Basic material
      const geometry = new BoxGeometry(3.5, 3.5, 3.5);
      const material = new MeshBasicMaterial({ color: 0xea794e });

      const mesh = new Mesh(geometry, material)
        .translateX(-10);
      this.container.add(mesh);
    }

    {
      // Sample: Sphere and Lambert material
      const geometry = new SphereGeometry(2.5);
      const material = new MeshLambertMaterial({ color: 0x7795f3 });

      const mesh = new Mesh(geometry, material)
        .translateX(-5);
      this.container.add(mesh);
    }

    {
      // Sample: Cylinder and Phong material
      const geometry = new CylinderGeometry(2, 2, 4, 20, 32);
      const material = new MeshPhongMaterial({ color: 0x1d1d35 });

      const mesh = new Mesh(geometry, material);
      this.container.add(mesh);
    }

    {
      // Sample: Torus and Standard material
      const geometry = new TorusGeometry(1.5, 0.8, 16, 100);
      const material = new MeshStandardMaterial({ color: 0x44aa88 });

      const mesh = new Mesh(geometry, material)
        .translateX(5);
      this.container.add(mesh);
    }

    {
      // Sample: Extrude and Physical material
      const shape = new Shape();
      const x = -2.5;
      const y = -5;
      shape.moveTo(x + 2.5, y + 2.5);
      shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
      shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
      shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
      shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
      shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
      shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

      const extrudeSettings = {
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
      };

      const geometry = new ExtrudeGeometry(shape, extrudeSettings);
      const material = new MeshPhysicalMaterial({ color: 0xbf9230 });

      const mesh = new Mesh(geometry, material)
        .translateX(10);
      mesh.scale.set(0.35, 0.35, 0.35);
      this.container.add(mesh);
    }
  }

  start(): void {
    this.allLights.forEach((light) => {
      light.turnOff();
    });
    this.container.visible = true;
  }

  end(): void {
    this.allLights.forEach((light) => {
      light.turnOn();
    });
    this.container.visible = false;
  }
}

export class MeshesAndLightsSample extends Object3D implements Updatable, Pages {
  private updatableObjects: Updatable[];
  private currentPage: SamplePage;

  constructor(allLights: LightHandle[]) {
    super();

    this.updatableObjects = [];
    console.log(allLights)

    const initialPage = new EmptySamplePage();
    const setupPage = new SetupPage(this, allLights);
    const finalPage = new EmptySamplePage();

    initialPage.setNext(setupPage);
    setupPage.setNext(finalPage);

    this.currentPage = initialPage;
  }

  hasNext(): boolean {
    return this.currentPage.getNext() !== null;
  }

  hasPrevious(): boolean {
    return this.currentPage.getPrevious() !== null;
  }

  next(): void {
    const nextPage = this.currentPage.getNext();
    if (!nextPage) {
      return;
    }

    this.currentPage.end();
    nextPage.start();
    this.currentPage = nextPage;
  }

  previous(): void {
    const previousPage = this.currentPage.getPrevious();
    if (!previousPage) {
      return;
    }

    this.currentPage.end();
    previousPage.start();
    this.currentPage = previousPage;
  }

  update(params: UpdateParams): void {
    this.updatableObjects.forEach((updatable) => {
      updatable.update(params);
    });
  }
}
