import { Component, ElementRef, HostListener, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Display } from 'app/display';

@Component({
  selector: 'wt-display-container',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `],
})
export class DisplayContainerComponent implements OnInit {
  private display!: Display;

  constructor(private ngZone: NgZone, private elementRef: ElementRef) { }

  ngOnInit(): void {
    const container: HTMLElement = this.elementRef.nativeElement;
    this.ngZone.runOutsideAngular(() => {
      this.display = new Display(container);
      this.display.setUpOrbitControls();
      this.display.bootstrapScene();
      this.display.animate();
    });
  }

  @HostListener('window:resize')
  resize(): void {
    this.ngZone.runOutsideAngular(() => {
      this.display.resize();
    });
  }
}
