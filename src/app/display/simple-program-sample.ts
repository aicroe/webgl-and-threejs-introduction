import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three';

import { Updatable, UpdateParams } from 'app/common';

export class SimpleProgramSample extends Object3D implements Updatable {
  constructor() {
    super();

    const boxWidth = 5;
    const boxHeight = 5;
    const boxDepth = 5;
    const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new MeshPhongMaterial({ color: 0x44aa88 });

    const cube = new Mesh(geometry, material);

    this.add(cube);
  }

  update({ elapsed }: UpdateParams): void {
    this.rotation.x = elapsed;
    this.rotation.y = elapsed;
  }
}
