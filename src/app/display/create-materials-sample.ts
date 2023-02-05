import {
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from 'three';

export function createMaterialsSample(): Object3D {
  const object = new Object3D();

  const geometry = new SphereGeometry(2);

  const basicMaterial = new MeshBasicMaterial({ color: 0xea794e });
  const lambertMaterial = new MeshLambertMaterial({ color: 0xea794e });
  const phongMaterial = new MeshPhongMaterial({ color: 0xea794e });
  const standardMaterial = new MeshStandardMaterial({ color: 0xea794e });
  const physicalMaterial = new MeshPhysicalMaterial({ color: 0xea794e });

  object.add(new Mesh(geometry, basicMaterial).translateX(-10));
  object.add(new Mesh(geometry, lambertMaterial).translateX(-5));
  object.add(new Mesh(geometry, phongMaterial));
  object.add(new Mesh(geometry, standardMaterial).translateX(5));
  object.add(new Mesh(geometry, physicalMaterial).translateX(10));

  return object;
}
