import { setPosition } from 'app/common';
import { Group, PerspectiveCamera } from 'three';
import { createColumnPanel } from './create-column-panel';
import { FocusControl } from './focus-control';
import { FocusPoint } from './focus-point';

function createPipelineStage(source: string): FocusPoint {
  const panel = createColumnPanel(source);
  return new FocusPoint(panel);
}

export function createGraphicsPipelineScene(
  camera: PerspectiveCamera,
): { scene: Group, control: FocusControl } {
  const scene = new Group();
  const control = new FocusControl(camera);

  const vertexShader = createPipelineStage('assets/graphics-pipeline/vertex-shader.png');
  const shapeAssembly = createPipelineStage('assets/graphics-pipeline/shape-assembly.png');
  const rasterization = createPipelineStage('assets/graphics-pipeline/rasterization.png');
  const fragmentShader = createPipelineStage('assets/graphics-pipeline/fragment-shader.png');
  const testingAndBlending = createPipelineStage('assets/graphics-pipeline/testing-and-blending.png');

  setPosition(vertexShader, { x: -10, z: 5 });
  vertexShader.rotateY(Math.PI / 2);

  setPosition(shapeAssembly, { x: -7, z: -1 });
  shapeAssembly.rotateY(Math.PI / 4);

  setPosition(rasterization, { z: -3 });

  setPosition(fragmentShader, { x: 7, z: -1 });
  fragmentShader.rotateY(-Math.PI / 4);

  setPosition(testingAndBlending, { x: 10, z: 5 })
  testingAndBlending.rotateY(-Math.PI / 2);

  scene.add(vertexShader);
  scene.add(shapeAssembly);
  scene.add(rasterization);
  scene.add(fragmentShader);
  scene.add(testingAndBlending);

  control.addPoint(vertexShader);
  control.addPoint(shapeAssembly);
  control.addPoint(rasterization);
  control.addPoint(fragmentShader);
  control.addPoint(testingAndBlending);

  return { scene, control };
}
