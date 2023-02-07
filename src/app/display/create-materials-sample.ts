import {
  Group,
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
  const group = new Group();

  const geometry = new SphereGeometry(2);

  const basicMaterial = new MeshBasicMaterial({ color: 0xea794e });
  const lambertMaterial = new MeshLambertMaterial({ color: 0xea794e });
  const phongMaterial = new MeshPhongMaterial({ color: 0xea794e });
  const standardMaterial = new MeshStandardMaterial({ color: 0xea794e });
  const physicalMaterial = new MeshPhysicalMaterial({ color: 0xea794e });

  const basicMesh = new Mesh(geometry, basicMaterial).translateX(-10);
  const lambertMesh = new Mesh(geometry, lambertMaterial).translateX(-5);
  const phongMesh = new Mesh(geometry, phongMaterial);
  const standardMesh = new Mesh(geometry, standardMaterial).translateX(5);
  const physicalMesh = new Mesh(geometry, physicalMaterial).translateX(10);

  basicMesh.castShadow = true;
  basicMesh.receiveShadow = true;
  lambertMesh.castShadow = true;
  lambertMesh.receiveShadow = true;
  phongMesh.castShadow = true;
  phongMesh.receiveShadow = true;
  standardMesh.castShadow = true;
  standardMesh.receiveShadow = true;
  physicalMesh.castShadow = true;
  physicalMesh.receiveShadow = true;

  group.add(basicMesh);
  group.add(lambertMesh);
  group.add(phongMesh);
  group.add(standardMesh);
  group.add(physicalMesh);

  return group;
}
