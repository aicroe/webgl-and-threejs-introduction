import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { animationFrames, tap, throttleTime } from 'rxjs';

import { Display } from 'app/display';

@Component({
  selector: 'wt-display-container',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './display-container.component.html',
  styleUrls: ['./display-container.component.scss'],
})
export class DisplayContainerComponent implements OnInit {
  @ViewChild('viewport', { static: true }) viewport!: ElementRef;

  private display!: Display;

  constructor() { }

  ngOnInit(): void {
    const viewportElement: HTMLElement = this.viewport.nativeElement;
    this.display = new Display(viewportElement);
    this.display.setUpOrbitControls();
    this.display.bootstrapScene();
    this.display.addHelpers();
    this.animate();
  }

  @HostListener('window:resize')
  resize(): void {
    this.display.resize();
  }

  focusNext(): void {
    this.display.focusNext();
  }

  focusPrevious(): void {
    this.display.focusPrevious();
  }

  private animate(): void {
    animationFrames().pipe(
      tap(() => {
        this.display.update();
      }),
      throttleTime(20),
    ).subscribe({
      next: ({ timestamp }) => {
        this.display.render(timestamp);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
