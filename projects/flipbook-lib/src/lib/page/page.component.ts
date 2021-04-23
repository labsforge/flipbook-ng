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

  @HostBinding('style.left') get hostLeft() { return this.width + 'px'; }
  @HostBinding('style.transform') get hostRotation() { return `rotateY(${this.rotation}deg)`; }

  constructor() { }

}
