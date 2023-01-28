import { Object3D } from 'three';
import { FocusPoint } from './focus-point';
import { QuickSlider } from './quick-slider';

export class QuickSliderFocusPoint extends FocusPoint {
  constructor(
    private slider: QuickSlider,
    observer: Object3D,
  ) {
    super(slider, observer);
  }

  override getNext(): FocusPoint | null {
    if (this.slider.hasNext()) {
      this.slider.next();
      return this;
    }

    return super.getNext();
  }

  override getPrevious(): FocusPoint | null {
    if (this.slider.hasPrevious()) {
      this.slider.previous();
      return this;
    }

    return super.getPrevious();
  }
}
