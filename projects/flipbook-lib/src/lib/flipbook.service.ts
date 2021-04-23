import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from './interfaces';

@Injectable({ providedIn: 'root' })
export class FlipbookService {

  prev = new Subject<void>();
  play = new Subject<void>();
  pause = new Subject<void>();
  next = new Subject<void>();
  goTo = new Subject<number>();

  currentPage = new Subject<number>();

  book: Book;

  constructor() { }

}
