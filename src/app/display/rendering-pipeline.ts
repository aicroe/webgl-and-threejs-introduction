import { setPosition } from 'app/common';
import { Object3D } from 'three';
import { RenderingPipelinePost } from './rendering-pipeline-post';

export class RenderingPipeline extends Object3D {
  constructor() {
    super();
    const vertexShader = new RenderingPipelinePost('assets/rendering-pipeline/vertex-shader.png');
    const shapeAssembly = new RenderingPipelinePost('assets/rendering-pipeline/shape-assembly.png');
    const rasterization = new RenderingPipelinePost('assets/rendering-pipeline/rasterization.png');
    const fragmentShader = new RenderingPipelinePost('assets/rendering-pipeline/fragment-shader.png');
    const testingAndBlending = new RenderingPipelinePost('assets/rendering-pipeline/testing-and-blending.png');

    setPosition(vertexShader, { x: -10, z: 5 });
    vertexShader.rotateY(Math.PI / 2);

    setPosition(shapeAssembly, { x: -7, z: -1 });
    shapeAssembly.rotateY(Math.PI / 4);

    setPosition(rasterization, { z: -3 });

    setPosition(fragmentShader, { x: 7, z: -1 });
    fragmentShader.rotateY(-Math.PI / 4);

    setPosition(testingAndBlending, { x: 10, z: 5 })
    testingAndBlending.rotateY(-Math.PI / 2);

    this.add(vertexShader);
    this.add(shapeAssembly);
    this.add(rasterization);
    this.add(fragmentShader);
    this.add(testingAndBlending);
  }
}
