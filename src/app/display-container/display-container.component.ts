import {
  ApplicationRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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

  areAssetsLoading = true;
  isFullScreen = false;

  private display!: Display;

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
  ) { }

  ngOnInit(): void {
    const viewportElement: HTMLElement = this.viewport.nativeElement;
    this.display = new Display(viewportElement);
    this.display.bootstrapScene();
    this.display.setLoadHandler('onLoad', this.assetsLoadedHandler);
    this.display.setLoadHandler('onError', this.assetErrorHandler);
    this.animate();
  }

  @HostListener('window:resize')
  resize(): void {
    this.display.resize();
  }

  next(): void {
    this.display.next();
  }

  previous(): void {
    this.display.previous();
  }

  enterFullScreen(): void {
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      this.elementRef.nativeElement.requestFullscreen();
      this.isFullScreen = true;
      this.appRef.tick();
    }
  }

  exitFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.isFullScreen = false;
      this.appRef.tick();
    }
  }

  private animate(): void {
    animationFrames().pipe(
      tap(() => {
        this.display.update();
      }),
      throttleTime(20),
    ).subscribe({
      next: () => {
        this.display.render();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private assetsLoadedHandler = () => {
    this.areAssetsLoading = false;
    this.appRef.tick();
  }

  private assetErrorHandler = (asset: unknown) => {
    console.error('Error loading asset:', asset);
  }
}
