import { Object3D } from 'three';

export class QuickSliderNode {
  private next: QuickSliderNode | null = null;
  private previous: QuickSliderNode | null = null;

  constructor(private object: Object3D | null) {}

  getObject(): Object3D | null {
    return this.object;
  }

  getNext(): QuickSliderNode | null {
    return this.next;
  }

  getPrevious(): QuickSliderNode | null {
    return this.previous;
  }

  setNext(next: QuickSliderNode): void {
    this.next = next;
    this.next.previous = this;
  }

  setPrevious(previous: QuickSliderNode): void {
    this.previous = previous;
    this.previous.next = this;
  }
}
