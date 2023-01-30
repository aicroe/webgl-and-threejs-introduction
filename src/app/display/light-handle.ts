import { Light } from 'three';

export class LightHandle {
  private light: Light | undefined;

  constructor(light?: Light) {
    this.light = light;
  }

  setLight(light: Light): void {
    this.light = light;
  }

  turnOff(): void {
    if (this.light) {
      this.light.visible = false;
    }
  }

  turnOn(): void {
    if (this.light) {
      this.light.visible = true;
    }
  }
}
