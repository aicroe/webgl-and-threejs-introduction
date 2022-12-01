import { ApplicationRef, Component } from '@angular/core';

@Component({
  selector: 'wt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private appRef: ApplicationRef) {}

  tick() {
    this.appRef.tick();
  }
}
