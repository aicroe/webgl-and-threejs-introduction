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
import { EmptySamplePage, SamplePage } from './sample-page';
import { SamplePages } from './sample-pages';

export class MeshesAndLightsSample extends SamplePages {
  constructor(private allLights: LightHandle[]) {
    super();

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

    this.currentPage = connectNodes(
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
    geometriesSample.visible = false;
    materialsSample.visible = false;
    ambientLightHandle.turnOff();
    directionalLightHandle.turnOff();
    pointLightHandle.turnOff();
    spotLightHandle.turnOff();
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
