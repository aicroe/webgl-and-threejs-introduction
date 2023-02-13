import { Object3D, Vector3 } from 'three';
import { Pages } from './pages';
import { QuickSliderNode } from './quick-slider-node';

class SliderMotion {
  constructor(
    private object: Object3D,
    private target: Vector3,
    private updateFactor: number,
    private distanceTolerance: number,
  ) {}

  update(): void {
    if (this.isComplete()) {
      return;
    }

    this.object.position.lerp(
      this.target,
      this.updateFactor,
    );
  }

  private isComplete(): boolean {
    const distance = this.object.position.distanceToSquared(this.target);
    return distance <= this.distanceTolerance;
  }
}

export class QuickSlider extends Object3D implements Pages {
  private left: Vector3;
  private right: Vector3;
  private center: Vector3;
  private motionList: SliderMotion[];
  private activeNode: QuickSliderNode;

  constructor(
    private nodes: QuickSliderNode[],
    private distance = 80,
    private readonly updateFactor = 0.25,
    private readonly distanceTolerance = 0.001,
  ) {
    super();
    this.left = new Vector3(-this.distance, 0, 0);
    this.right = new Vector3(this.distance, 0, 0);
    this.center = new Vector3(0, 0, 0);

    this.motionList = [];
    this.activeNode = new QuickSliderNode(null);

    const slider = this;
    const lastNode = this.nodes
      .filter((node) => !!node.getObject())
      .reduce((previousNode, node) => {
        const object = node.getObject()!;
        object.visible = false;
        object.position.copy(this.left);
        slider.add(object);

        node.setPrevious(previousNode);

        return node;
      }, this.activeNode);
    lastNode.setNext(new QuickSliderNode(null));
  }

  hasNext(): boolean {
    return this.activeNode.getNext() !== null;
  }

  hasPrevious(): boolean {
    return this.activeNode.getPrevious() !== null;
  }

  next(): void {
    const nextNode = this.activeNode.getNext();
    if (!nextNode) {
      return;
    }

    this.hideAllNodes();

    const motionList = [] as SliderMotion[];
    if (this.activeNode.getObject()) {
      motionList.push(this.createMotion(this.activeNode.getObject()!, this.right));
    }
    if (nextNode?.getObject()) {
      motionList.push(this.createMotion(nextNode.getObject()!, this.center));
    }
    this.motionList = motionList;
    this.activeNode = nextNode;
  }

  previous(): void {
    const previousNode = this.activeNode.getPrevious();
    if (!previousNode) {
      return;
    }

    this.hideAllNodes();

    const motionList = [] as SliderMotion[];
    if (this.activeNode.getObject()) {
      motionList.push(this.createMotion(this.activeNode.getObject()!, this.left));
    }
    if (previousNode?.getObject()) {
      motionList.push(this.createMotion(previousNode.getObject()!, this.center));
    }
    this.motionList = motionList;
    this.activeNode = previousNode;
  }

  update(): void {
    this.motionList.forEach((motion) => motion.update());
  }

  private createMotion(object: Object3D, target: Vector3): SliderMotion {
    object.visible = true;
    return new SliderMotion(
      object,
      target,
      this.updateFactor,
      this.distanceTolerance,
    );
  }

  private hideAllNodes(): void {
    this.nodes.forEach((node) => {
      const object = node.getObject();
      if (object) {
        object.visible = false;
      }
    });
  }
}
