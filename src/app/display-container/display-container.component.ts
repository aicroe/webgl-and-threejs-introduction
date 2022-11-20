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
      background: rgb(241, 241, 241);
      background: radial-gradient(
        circle,
        rgba(241, 241, 241, 1) 5%,
        rgba(205, 205, 205, 1) 45%,
        rgba(161, 161, 161, 1) 100%
      );
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
