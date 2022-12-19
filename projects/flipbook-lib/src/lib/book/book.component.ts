import { Power2, TimelineLite, TweenLite } from 'gsap';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit
} from '@angular/core';

import { Book, BookPageSide, Page, PageType } from '../interfaces';
import { FlipbookService } from '../flipbook.service';

const DEFAULT_BACKGROUND_COLOR = '#fff';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'flipbook',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent implements OnInit, OnDestroy {

  @Input() model: Book;
  @Input() startAt: number;

  @HostBinding('style.width.px')
  get hostWidth() {
    this.cdr.detectChanges();
    return this.model.width * this.model.zoom;
  }

  @HostBinding('style.height.px')
  get hostHeight() {
    return this.model.height * this.model.zoom;
  }

  @HostBinding('style.perspective.px')
  get hostPerspective() {
    return this.model.width * this.model.zoom * 2;
  }

  currentIndex = 0;
  pages: Page[];

  private destroyed = new Subject<void>();
  private flipTimeLine: TimelineLite;
  private navigationQueue: number[] = [];

  private render = () => { this.cdr.detectChanges(); };

  private sortBook = (index: number) => {
    this.navigationQueue.shift();

    if (this.flipTimeLine && this.navigationQueue.length > 0) { return; }

    const page = this.pages.find(p => p.index === index);
    this.currentIndex = page
      ? page.rotation < -90 ? page.index : page.index - 1
      : index;

    this.pages.sort((a, b) => {
      const diffa = Math.abs(a.index - this.currentIndex) + (a.rotation === -180 ? 1 : 0);
      const diffb = Math.abs(b.index - this.currentIndex);

      return diffa - diffb;
    });

    this.render();
    this.service.currentPage.next(this.currentIndex + 1);
  }

  private setPageAtTop = (page) => {
    this.pages.unshift(this.pages.splice(this.pages.indexOf(page), 1)[0]);
  }


  constructor(private service: FlipbookService, private cdr: ChangeDetectorRef, private elr: ElementRef) {
    cdr.detach();

    service.prev.pipe(takeUntil(this.destroyed)).subscribe(() => this.navigate(-1));
    service.next.pipe(takeUntil(this.destroyed)).subscribe(() => this.navigate(1));
    service.play.pipe(takeUntil(this.destroyed)).subscribe(() => this.play());
    service.pause.pipe(takeUntil(this.destroyed)).subscribe(() => this.pause());
    service.goTo.pipe(takeUntil(this.destroyed)).subscribe(index => this.goTo(index));
  }

  ngOnInit() {
    // TODO: Implement startPageType / endPageType
    this.pages = [];

    const pages = this.model.pages.slice();
    const hasCover = this.model && this.model.cover !== undefined;
    const pageWidth = this.model.pageWidth || this.model.width / 2;
    const pageHeight = this.model.pageHeight || this.model.height;

    if (this.model && pages.length > 1) {
      if (!hasCover && this.model.startPageType === PageType.Single) {
        // add first white page block
        this.pages.push({
          index: this.pages.length,
          lock: true,
          front: {
            imageUrl: '',
            width: pageWidth,
            height: pageHeight,
            backgroundColor: DEFAULT_BACKGROUND_COLOR
          },
          back: {
            imageUrl: '',
            width: pageWidth,
            height: pageHeight,
            backgroundColor: DEFAULT_BACKGROUND_COLOR
          },
          rotation: -180
        });
      } else {
        const frontCover: Page = {
          index: this.pages.length,
          lock: !hasCover,
          front: hasCover ? {
            imageUrl: this.model.cover.front.imageUrl,
            isCover: true,
            width: this.model.width / 2,
            height: this.model.height,
            backgroundColor: this.model.cover.front.backgroundColor,
            opacity: this.model.cover.front.opacity,
          } : undefined,
          back: {
            imageUrl: '',
            backgroundColor: hasCover ? this.model.cover.front.backgroundColor : DEFAULT_BACKGROUND_COLOR,
            opacity: hasCover ? this.model.cover.front.opacity : 1,
            width: pageWidth,
            height: pageHeight,
          },
          rotation: hasCover ? 0 : -180
        };

        if (this.model.startPageType !== PageType.Single) {
          const firstPage: BookPageSide = pages.shift();
          frontCover.back.imageUrl = firstPage.imageUrl;
          frontCover.back.backgroundColor = firstPage.backgroundColor;
          frontCover.back.opacity = firstPage.opacity;
        }

        this.pages.push(frontCover);
      }

      while (pages.length > 1) {
        const frontPage: BookPageSide = pages.shift();
        const backPage: BookPageSide = pages.shift();
        this.pages.push({
          index: this.pages.length,
          front: {
            imageUrl: frontPage.imageUrl,
            width: pageWidth,
            height: pageHeight,
            backgroundColor: frontPage.backgroundColor,
            opacity: frontPage.opacity,
          },
          back: {
            imageUrl: backPage.imageUrl,
            width: pageWidth,
            height: pageHeight,
            backgroundColor: backPage.backgroundColor,
            opacity: backPage.opacity,
          },
          rotation: 0
        });
      }

      if (!hasCover && this.model.endPageType === PageType.Single) {
        // add last white page block
        this.pages.push({
          index: this.pages.length,
          lock: true,
          front: {
            imageUrl: '',
            width: pageWidth,
            height: pageHeight,
            backgroundColor: DEFAULT_BACKGROUND_COLOR
          },
          back: {
            imageUrl: '',
            width: pageWidth,
            height: pageHeight,
            backgroundColor: DEFAULT_BACKGROUND_COLOR
          },
          rotation: 0
        });
      } else {
        const backCover: Page = {
          index: this.pages.length,
          lock: !hasCover,
          front: {
            imageUrl: '',
            backgroundColor: hasCover ? this.model.cover.back.backgroundColor : DEFAULT_BACKGROUND_COLOR,
            opacity: hasCover ? this.model.cover.back.opacity : 1,
            width: pageWidth,
            height: pageHeight,
          },
          back: this.model.cover ? {
            imageUrl: this.model.cover.back.imageUrl,
            isCover: true,
            width: this.model.width / 2,
            height: this.model.height,
            backgroundColor: this.model.cover.back.backgroundColor,
            opacity: this.model.cover.back.opacity,
          } : undefined,
          rotation: 0
        };

        if (this.model.startPageType !== PageType.Single && pages.length) {
          const lastPage: BookPageSide = pages.shift();
          backCover.front.imageUrl = lastPage.imageUrl;
          backCover.front.backgroundColor = lastPage.backgroundColor;
          backCover.front.opacity = lastPage.opacity;
        }

        this.pages.push(backCover);
      }
    }

    if (this.startAt !== undefined && this.startAt !== this.currentIndex) {
      this.goTo(this.startAt);
    } else {
      this.sortBook(this.currentIndex - 1);
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  update() {
    this.render();
  }

  onPageDown(event: MouseEvent, page: Page) {
    if (TweenLite.getTweensOf(page, true).length > 0) { return; }

    if (page.lock) {
      this.flipTimeLine = new TimelineLite({ autoRemoveChildren: true });
      this.flipTimeLine.add(TweenLite.to(page, 0.3,
        {
          rotation: page.rotation < -90 ? -175 : -5,
          ease: Power2.easeOut,
          onUpdate: this.render
        })
      );
      this.flipTimeLine.add(TweenLite.to(page, 0.2,
        {
          rotation: page.rotation < -90 ? -180 : 0,
          ease: Power2.easeOut,
          onUpdate: this.render
        })
      );

      return;
    }

    const startX = event.pageX;
    const startY = event.pageY;
    let hasMoved = false;

    const mouseUpEvt = fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(
        tap(() => {
          this.flipTimeLine = new TimelineLite({ autoRemoveChildren: true });

          if (!hasMoved) {
            this.navigationQueue.push(page.rotation < -90 ? page.index - 1 : page.index);
            this.flipTimeLine.add(TweenLite.to(page, 1,
              {
                rotation: page.rotation < -90 ? 0 : -180,
                ease: Power2.easeOut,
                onStart: this.setPageAtTop,
                onStartParams: [page],
                onUpdate: this.render,
                onComplete: this.sortBook,
                onCompleteParams: [page.rotation < -90 ? page.index - 1 : page.index]
              }));
          } else {
            this.navigationQueue.push(page.rotation < -90 ? page.index : page.index - 1);
            this.flipTimeLine.add(TweenLite.to(page, 1,
              {
                rotation: page.rotation < -90 ? -180 : 0,
                ease: Power2.easeOut,
                onUpdate: this.render,
                onComplete: this.sortBook,
                onCompleteParams: [page.rotation < -90 ? page.index : page.index - 1]
              }));
          }
        })
      );

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        takeUntil(mouseUpEvt)
      )
      .subscribe(movEvt => {
        const movEvent = movEvt as MouseEvent;
        const bookBounds = this.elr.nativeElement.getBoundingClientRect();

        hasMoved = startX !== movEvent.pageX || startY !== movEvent.pageY;

        this.setPageAtTop(page);

        if (movEvent.pageX < bookBounds.left) {
          page.rotation = -180;
        } else if (movEvent.pageX > bookBounds.left + bookBounds.width) {
          page.rotation = 0;
        } else {
          page.rotation = -180 + ((movEvent.pageX - bookBounds.left) / bookBounds.width) * 180;
        }

        this.render();
      });
  }

  onPagePan(event, page) {
    if (TweenLite.getTweensOf(page, true).length > 0) { return; }

    if (page.lock) {
      this.flipTimeLine = new TimelineLite();
      this.flipTimeLine.add(TweenLite.to(page, 0.3,
        {
          rotation: page.rotation < -90 ? -175 : -5,
          ease: Power2.easeOut,
          onUpdate: this.render
        })
      );
      this.flipTimeLine.add(TweenLite.to(page, 0.2,
        {
          rotation: page.rotation < -90 ? -180 : 0,
          ease: Power2.easeOut,
          onUpdate: this.render
        })
      );

      return;
    }

    this.setPageAtTop(page);

    const bookBounds = this.elr.nativeElement.getBoundingClientRect();

    if (event.center.x < bookBounds.left) {
      page.rotation = -180;
    } else if (event.center.x > bookBounds.left + bookBounds.width) {
      page.rotation = 0;
    } else {
      page.rotation = -180 + ((event.center.x - bookBounds.left) / bookBounds.width) * 180;
    }

    this.render();
  }

  onPagePanEnd(event, page) {
    this.flipTimeLine = new TimelineLite();
    this.flipTimeLine.add(TweenLite.to(page, 1,
      {
        rotation: page.rotation < -90 ? -180 : 0,
        ease: Power2.easeOut,
        onUpdate: this.render,
        onComplete: this.sortBook,
        onCompleteParams: [page.rotation < -90 ? page.index : page.index - 1]
      }));
  }

  onSwipe(event, page) {
    if (page.lock) { return; }

    if (TweenLite.getTweensOf(page, true).length > 0) {
      TweenLite.getTweensOf(page, true)[0].kill();
    }

    const direction = event.deltaX > 0 ? -1 : 1;

    this.flipTimeLine.add(TweenLite.to(page, 1,
      {
        rotation: direction === 1 ? -180 : 0,
        ease: Power2.easeOut,
        onUpdate: this.render,
        onComplete: this.sortBook,
        onCompleteParams: [this.currentIndex + direction]
      }));
  }

  navigate(direction: number) {
    const lastNavigationIndex = this.navigationQueue.length
      ? this.navigationQueue[this.navigationQueue.length - 1]
      : this.currentIndex;

    const pageIndex = direction === 1 ? lastNavigationIndex + 1 : lastNavigationIndex;
    const page = this.pages.find(p => p.index === pageIndex);

    if (page === undefined || page.lock) { return; }

    if (direction === 1 && page.rotation === -180) { return; }
    if (direction === -1 && page.rotation === 0) { return; }

    this.navigationQueue.push(lastNavigationIndex + direction);

    this.flipTimeLine = new TimelineLite({ autoRemoveChildren: true });
    this.flipTimeLine.add(TweenLite.to(page, 1,
      {
        rotation: direction === 1 ? -180 : 0,
        ease: Power2.easeOut,
        onStart: this.setPageAtTop,
        onStartParams: [page],
        onUpdate: this.render,
        onComplete: lastNavigationIndex + direction < this.pages.length ? this.sortBook : void 0,
        onCompleteParams: [lastNavigationIndex + direction]
      }
    ));
  }

  goTo(index: number) {
    if (this.currentIndex === index - 1) { return; }

    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages.find(p => p.index === i);
      page.rotation = i < index ? -180 : 0;
      if (i <= index) {
        this.setPageAtTop(page);
      }
    }

    this.sortBook(index - 1);
  }

  play() {
    if (this.flipTimeLine && this.flipTimeLine.totalDuration() > this.flipTimeLine.time()) {
      this.flipTimeLine.resume(null, false);
    } else {
      this.flipTimeLine = new TimelineLite({ autoRemoveChildren: true });

      this.pages.forEach((page, index) => {
        if (page.rotation === 0 && !page.lock) {
          this.flipTimeLine.add(TweenLite.to(page, 1,
            {
              delay: index - (page.rotation < -90 ? 0 : 1) === this.currentIndex ? 0 : 2.5,
              rotation: -180,
              ease: Power2.easeOut,
              onStart: this.setPageAtTop,
              onStartParams: [page],
              onUpdate: this.render,
              onComplete: page.index + 1 < this.pages.length ? this.sortBook : void 0,
              onCompleteParams: [page.index + 1]
            }
          ));
        }
      });
    }
  }

  pause() {
    if (this.flipTimeLine) {
      const tweens = this.flipTimeLine.getChildren(true, true, true, this.flipTimeLine.time());
      if (tweens.length > 0) {
        this.flipTimeLine.addPause(tweens[0].startTime());
      }
    }
  }

}
