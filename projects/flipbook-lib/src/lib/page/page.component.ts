import { Component, Input, HostBinding } from '@angular/core';
import { Page } from '../interfaces';

@Component({
  selector: 'flipbook-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {

  @Input() page: Page;
  @Input() width: number;
  @Input() height: number;
  @Input() rotation: number;
  @Input() zoom: number;

  @HostBinding('style.left.px')
  get hostLeft() {
    return this.width * this.zoom;
  }

  @HostBinding('style.transform')
  get hostRotation() {
    return `rotateY(${this.page.rotation}deg)`;
  }

  constructor() { }

}
