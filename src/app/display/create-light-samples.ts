import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PointLight,
  SpotLight,
} from 'three';
import { LightHandle } from './light-handle';

export function createAmbientLightSample(): {
  ambientLight: AmbientLight,
  ambientLightHandle: LightHandle,
} {
  const ambientLight = new AmbientLight(0x9f3838, 0.65);
  const ambientLightHandle = new LightHandle(ambientLight);

  return { ambientLight, ambientLightHandle };
}

export function createDirectionalLightSample(): {
  directionalLight: DirectionalLight,
  directionalLightHandle: LightHandle,
} {
  const directionalLight = new DirectionalLight(0xf1f1f1, 1)
    .translateZ(6);
  const directionalLightHandle = new LightHandle(directionalLight);

  directionalLight.castShadow = true;

  return { directionalLight, directionalLightHandle };
}

export function createPointLightSample(): {
  pointLight: PointLight,
  pointLightHandle: LightHandle,
} {
  const pointLight = new PointLight(0xf1f1f1, 1)
    .translateZ(6);
  const pointLightHandle = new LightHandle(pointLight);

  const origin = new Mesh(
    new OctahedronGeometry(0.5),
    new MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
  );
  pointLight.add(origin);
  pointLight.castShadow = true;

  return { pointLight, pointLightHandle };
}

export function createSpotLight(): {
  spotLight: SpotLight,
  spotLightHandle: LightHandle,
} {
  const spotLight = new SpotLight(0xf1f1f1, 1)
    .translateZ(8);
  const spotLightHandle = new LightHandle(spotLight);

  const origin = new Mesh(
    new OctahedronGeometry(0.5),
    new MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
  );
  spotLight.add(origin);
  spotLight.castShadow = true;

  return { spotLight, spotLightHandle };
}
