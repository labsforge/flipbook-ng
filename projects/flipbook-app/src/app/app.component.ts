import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Book, FlipbookService, PageType } from '@labsforge/pageflip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  get demoBook() {
    return this.flipService.book;
  }

  startAt = 0;
  currentPage = 1;

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
      cover: {
        front: {
          imageUrl: 'assets/demo/02-right.png',
        },
        back: {
          imageUrl: 'assets/demo/02-left.png',
        }
      },
      pages: [
        { // start guard section
          imageUrl: 'assets/demo/guard.jpg',
          backgroundColor: '#41473A', // don't use if want to see front-cover inverted image
        },
        {
          imageUrl: 'assets/demo/guard.jpg',
        }, // end guard section
        { // start transparent-sheet section
          imageUrl: 'assets/demo/blank.jpg',
        },
        {
          imageUrl: 'assets/demo/01-left.png',
          opacity: 0.6,
        },
        {
          imageUrl: 'assets/demo/blank.jpg',
          opacity: 0.4,
        },
        {
          imageUrl: 'assets/demo/blank.jpg',
        }, // end transparent-sheet section
        {
          imageUrl: 'assets/demo/03-left.png',
        },
        {
          imageUrl: 'assets/demo/03-right.png',
        },
        {
          imageUrl: 'assets/demo/04-left.png',
        },
        {
          imageUrl: 'assets/demo/04-right.png',
        },
        {
          imageUrl: 'assets/demo/05-left.png',
        },
        {
          imageUrl: 'assets/demo/05-right.png',
        },
        {
          imageUrl: 'assets/demo/06-left.png',
        },
        {
          imageUrl: 'assets/demo/06-right.png',
        },
        { // start guard section
          imageUrl: 'assets/demo/guard.jpg',
        },
        {
          imageUrl: 'assets/demo/guard.jpg',
          backgroundColor: '#41473A', // don't use if want to see back-cover inverted image
        }, // end guard section
      ],
      pageWidth: 585,
      pageHeight: 780,
      startPageType: PageType.Double,
      endPageType: PageType.Double
    } as Book;
  }

  onPrev() {
    this.flipService.prev.next();
  }

  onPlay() {
    this.flipService.play.next();
  }

  onPause() {
    this.flipService.pause.next();
  }

  onNext() {
    this.flipService.next.next();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (!this.flipService.book) { return; }

    const boundsWidth = this.elr.nativeElement.getBoundingClientRect().width * .8;
    const boundsHeight = this.elr.nativeElement.getBoundingClientRect().height * .6;

    this.flipService.book.zoom = Math.min(boundsWidth / this.flipService.book.width, boundsHeight / this.flipService.book.height);
  }

}
