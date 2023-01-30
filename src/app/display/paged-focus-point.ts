import { Object3D } from 'three';
import { FocusPoint } from './focus-point';
import { Pages } from './pages';

export class PagedFocusPoint extends FocusPoint {
  constructor(
    private pages: Pages,
    target: Object3D,
    observer: Object3D,
  ) {
    super(target, observer);
  }

  override getNext(): FocusPoint | null {
    if (this.pages.hasNext()) {
      this.pages.next();
      return this;
    }

    return super.getNext();
  }

  override getPrevious(): FocusPoint | null {
    if (this.pages.hasPrevious()) {
      this.pages.previous();
      return this;
    }

    return super.getPrevious();
  }
}
