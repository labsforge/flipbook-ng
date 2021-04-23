import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Book, FlipbookService } from '@labsforge/pageflip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  get demoBook() {
    return this.flipService.book;
  }

  constructor(
    private elr: ElementRef,
    private flipService: FlipbookService,
  ) {
  }

  ngOnInit() {
    this.flipService.book = {
      width: 1190,
      height: 800,
      zoom: 1,
      pages: [
        'assets/demo/01-left.png',
        'assets/demo/01-right.png',
        'assets/demo/02-left.png',
        'assets/demo/02-right.png',
        'assets/demo/03-left.png',
        'assets/demo/03-right.png',
        'assets/demo/04-left.png',
        'assets/demo/04-right.png',
        'assets/demo/05-left.png',
        'assets/demo/05-right.png',
        'assets/demo/06-left.png',
        'assets/demo/06-right.png',
      ]
    }
  }

  @HostListener('window:resize')
  public onWindowResize() {
    if (!this.flipService.book) { return; }

    const boundsWidth = this.elr.nativeElement.getBoundingClientRect().width * .8;
    const boundsHeight = this.elr.nativeElement.getBoundingClientRect().height * .6;

    this.flipService.book.zoom = Math.min(boundsWidth / this.flipService.book.width, boundsHeight / this.flipService.book.height);
  }

}
