import { AfterViewInit, Directive, ElementRef, EventEmitter, NgZone, OnDestroy, Output } from '@angular/core';

import 'hammerjs';

@Directive({
  selector: '[flipbookGestures]'
})
export class GesturesDirective implements AfterViewInit, OnDestroy {

  // Not HammerInput: the published .d.ts must not need @types/hammerjs in consumers.
  @Output() gesturePan = new EventEmitter<any>();
  @Output() gesturePanEnd = new EventEmitter<any>();
  @Output() gestureSwipe = new EventEmitter<any>();

  private managers: HammerManager[] = [];

  constructor(private elr: ElementRef, private zone: NgZone) { }

  ngAfterViewInit() {
    this.managers = [
      this.listen('pan', this.gesturePan),
      this.listen('panend', this.gesturePanEnd),
      this.listen('swipe', this.gestureSwipe),
    ];
  }

  ngOnDestroy() {
    this.managers.forEach(mc => mc.destroy());
  }

  // One manager per event, built like Angular's HammerGestureConfig, so touch-action and the panend-before-swipe order stay the same.
  private listen(eventName: string, output: EventEmitter<HammerInput>): HammerManager {
    return this.zone.runOutsideAngular(() => {
      const mc = new Hammer(this.elr.nativeElement);
      mc.get('pinch').set({ enable: true });
      mc.get('rotate').set({ enable: true });
      mc.on(eventName, event => this.zone.runGuarded(() => output.emit(event)));
      return mc;
    });
  }
}
