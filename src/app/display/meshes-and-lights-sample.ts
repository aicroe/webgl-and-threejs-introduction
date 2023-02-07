import { Object3D } from 'three';
import { connectNodes } from 'app/common';
import { createGeometriesSample } from './create-geometries-sample';
import {
  createAmbientLightSample,
  createDirectionalLightSample,
  createPointLightSample,
  createSpotLight,
} from './create-light-samples';
import { createMaterialsSample } from './create-materials-sample';
import { LightHandle } from './light-handle';
import { Pages } from './pages';
import { EmptySamplePage, SamplePage } from './sample-page';

export class MeshesAndLightsSample implements Pages {
  private object: Object3D;
  private currentPage: SamplePage;

  constructor(private allLights: LightHandle[]) {
    this.object = new Object3D();

    const container = this;
    const geometriesSample = createGeometriesSample();
    const materialsSample = createMaterialsSample();
    const { ambientLight, ambientLightHandle } = createAmbientLightSample();
    const { directionalLight, directionalLightHandle } = createDirectionalLightSample();
    const { pointLight, pointLightHandle } = createPointLightSample();
    const { spotLight, spotLightHandle } = createSpotLight();

    this.object.add(
      geometriesSample,
      materialsSample,
      ambientLight,
      directionalLight,
      directionalLight.target,
      pointLight,
      spotLight,
      spotLight.target,
    );

    const initialPage = new EmptySamplePage();
    const geometriesSamplePage = new class extends SamplePage {
      start(): void {
        geometriesSample.visible = true;
      }
      end(): void {
        geometriesSample.visible = false;
      }
    };
    const turnOffLightsPage = new class extends SamplePage {
      start(): void {
        container.turnOffLights();
      }
      end(): void {
        container.turnOnLights();
      }
    };
    const materialsSamplePage = new class extends SamplePage {
      start(): void {
        container.turnOffLights();
        materialsSample.visible = true;
      }
      end(): void {
        container.turnOnLights();
        materialsSample.visible = false;
      }
    }
    const ambientLightPage = new class extends SamplePage {
      start(): void {
        materialsSample.visible = true;
        container.turnOffLights();
        ambientLightHandle.turnOn();
      }
      end(): void {
        ambientLightHandle.turnOff();
        container.turnOnLights();
        materialsSample.visible = false;
      }
    };
    const directionalLightPage = new class extends SamplePage {
      start(): void {
        materialsSample.visible = true;
        container.turnOffLights();
        directionalLightHandle.turnOn();
      }
      end(): void {
        directionalLightHandle.turnOff();
        container.turnOnLights();
        materialsSample.visible = false;
      }
    };
    const pointLightPage = new class extends SamplePage {
      start(): void {
        materialsSample.visible = true;
        container.turnOffLights();
        pointLightHandle.turnOn();
      }
      end(): void {
        pointLightHandle.turnOff();
        container.turnOnLights();
        materialsSample.visible = false;
      }
    };
    const spotLightPage = new class extends SamplePage {
      start(): void {
        materialsSample.visible = true;
        container.turnOffLights();
        spotLightHandle.turnOn();
      }
      end(): void {
        spotLightHandle.turnOff();
        container.turnOnLights();
        materialsSample.visible = false;
      }
    };
    const finalPage = new EmptySamplePage();

    connectNodes(
      initialPage,
      geometriesSamplePage,
      turnOffLightsPage,
      materialsSamplePage,
      ambientLightPage,
      directionalLightPage,
      pointLightPage,
      spotLightPage,
      finalPage,
    );

    this.currentPage = initialPage;
    geometriesSample.visible = false;
    materialsSample.visible = false;
    ambientLightHandle.turnOff();
    directionalLightHandle.turnOff();
    pointLightHandle.turnOff();
    spotLightHandle.turnOff();
  }

  getObject(): Object3D {
    return this.object;
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

  private turnOffLights(): void {
    this.allLights.forEach((light) => {
      light.turnOff();
    });
  }

  private turnOnLights(): void {
    this.allLights.forEach((light) => {
      light.turnOn();
    });
  }
}
