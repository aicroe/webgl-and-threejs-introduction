import {
  AnimationAction,
  AnimationMixer,
  LoopOnce,
  Mesh,
  Object3D,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { subclip } from 'three/src/animation/AnimationUtils';
import { Updatable, UpdateParams } from 'app/common';

class ZombieMotion implements Updatable {
  private direction: Vector3;

  constructor(
    private zombie: Zombie,
    private target: Vector3,
    private updateFactor: number,
    private distanceTolerance: number,
  ) {
    this.direction = this.target
      .clone()
      .sub(this.zombie.position)
      .normalize();

    const directionScalar = this.direction.dot(new Vector3(1, 1, 1));
    this.zombie.rotation.y = (Math.PI / 2) * directionScalar;
  }

  restore(): void {
    this.zombie.rotation.y = 0;
  }

  update(): void {
    if (this.isComplete()) {
      this.restore();
      this.zombie.stopWalking();
      return;
    }

    this.zombie.position.addScaledVector(this.direction, this.updateFactor);
  }

  private isComplete(): boolean {
    const distance = this.zombie.position.distanceToSquared(this.target);
    return distance <= this.distanceTolerance;
  }
}

export class Zombie extends Object3D implements Updatable {
  private mixer?: AnimationMixer;
  private spawnAction?: AnimationAction;
  private idleAction?: AnimationAction;
  private walkAction?: AnimationAction;
  private dieAction?: AnimationAction;
  private motionList: ZombieMotion[];

  constructor(
    private readonly updateFactor = 0.1,
    private readonly distanceTolerance = 0.01,
  ) {
    super();

    this.motionList = [];

    new GLTFLoader()
      .loadAsync('assets/binaries/zombie.glb')
      .then((zombie) => {
        this.mixer = new AnimationMixer(zombie.scene);
        const [animation] = zombie.animations;

        this.spawnAction = this.mixer.clipAction(subclip(animation, 'spawn', 940, 979));
        this.spawnAction.loop = LoopOnce;
        this.spawnAction.clampWhenFinished = true;
        this.idleAction = this.mixer.clipAction(subclip(animation, 'idle', 489, 548));
        this.walkAction = this.mixer.clipAction(subclip(animation, 'walk', 1264, 1293));
        this.dieAction = this.mixer.clipAction(subclip(animation, 'die', 225, 251));
        this.dieAction.loop = LoopOnce;
        this.dieAction.clampWhenFinished = true;

        const zombieBody = zombie.scene.children[0];
        zombieBody.rotation.x = 0;
        zombieBody.scale.set(0.05, 0.05, 0.05);

        zombie.scene.traverse((object) => {
          if (object instanceof Mesh) {
            object.castShadow = true;
          }
        });

        this.mixer.addEventListener('finished', (event) => {
          if (event['action'] === this.spawnAction) {
            this.idleAction?.reset().play();
          }
        });

        this.add(zombie.scene);
      });
  }

  spawn(): void {
    this.spawnAction?.reset().play();
  }

  walk(target: Vector3): void {
    this.motionList = [
      new ZombieMotion(
        this,
        target,
        this.updateFactor,
        this.distanceTolerance,
      ),
    ];
    this.walkAction?.reset().play();
  }

  die(): void {
    this.dieAction?.reset().play();
  }

  stopWalking(): void {
    this.motionList = [];
    this.walkAction?.fadeOut(0.5);
    this.idleAction?.reset().fadeIn(0.5).play();
  }

  stopAllAction():void {
    this.motionList.forEach((motion) => motion.restore());
    this.motionList = [];
    this.mixer?.stopAllAction();
  }

  update({ delta}: UpdateParams): void {
    this.mixer?.update(delta);
    this.motionList.forEach((motion) => {
      motion.update();
    });
  }
}
