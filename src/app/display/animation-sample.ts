import { Vector3 } from 'three';
import { connectNodes, Updatable, UpdateParams } from 'app/common';
import { EmptySamplePage, SamplePage } from './sample-page';
import { SamplePages } from './sample-pages';
import { Zombie } from './zombie';

export class AnimationSample extends SamplePages implements Updatable {
  private zombie: Zombie;

  constructor() {
    super();

    this.zombie = new Zombie();
    const zombie = this.zombie;
    const zombieOrigin = new Vector3(-8, -3, 2.5);

    this.object.add(this.zombie);

    const initialPage = new EmptySamplePage();
    const spawnPage = new class extends SamplePage {
      start(): void {
        zombie.position.copy(zombieOrigin);
        zombie.visible = true;
        zombie.spawn();
      }
      end(): void {
        zombie.stopAllAction();
        zombie.visible = false;
      }
    };
    const walkRight = new class extends SamplePage {
      private target = zombieOrigin.clone().setX(10);
      start(): void {
        zombie.visible = true;
        zombie.walk(this.target);
      }
      end(): void {
        zombie.position.copy(this.target);
        zombie.stopAllAction();
        zombie.visible = false;
      }
    };
    const walkLeft = new class extends SamplePage {
      private target = zombieOrigin;
      start(): void {
        zombie.visible = true;
        zombie.walk(this.target);
      }
      end(): void {
        zombie.position.copy(this.target);
        zombie.stopAllAction();
        zombie.visible = false;
      }
    };
    const diePage = new class extends SamplePage {
      start(): void {
        zombie.position.copy(zombieOrigin);
        zombie.visible = true;
        zombie.die();
      }
      end(): void {
        zombie.stopAllAction();
        zombie.visible = false;
      }
    };
    const finalPage = new EmptySamplePage();

    this.currentPage = connectNodes(
      initialPage,
      spawnPage,
      walkRight,
      walkLeft,
      diePage,
      finalPage,
    );
    this.zombie.visible = false;
  }

  update(params: UpdateParams): void {
    this.zombie.update(params);
  }
}
