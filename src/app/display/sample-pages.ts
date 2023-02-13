import { Object3D } from 'three';
import { Pages } from './pages';
import { SamplePage } from './sample-page';

export abstract class SamplePages implements Pages {
  protected object: Object3D;
  protected currentPage: SamplePage | null;

  constructor() {
    this.object = new Object3D();
    this.currentPage = null;
  }

  getObject(): Object3D {
    return this.object;
  }

  hasNext(): boolean {
    return this.currentPage?.getNext() !== null;
  }

  hasPrevious(): boolean {
    return this.currentPage?.getPrevious() !== null;
  }

  next(): void {
    const nextPage = this.currentPage?.getNext();
    if (!this.currentPage || !nextPage) {
      return;
    }

    this.currentPage.end();
    nextPage.start();
    this.currentPage = nextPage;
  }

  previous(): void {
    const previousPage = this.currentPage?.getPrevious();
    if (!this.currentPage || !previousPage) {
      return;
    }

    this.currentPage.end();
    previousPage.start();
    this.currentPage = previousPage;
  }
}
