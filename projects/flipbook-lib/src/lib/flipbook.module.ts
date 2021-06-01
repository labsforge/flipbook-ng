import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BookComponent } from './book/book.component';
import { PageComponent } from './page/page.component';
import { FlipbookService } from './flipbook.service';
import { ReversePipe } from './pipes/reverse.pipe';
import { HammerModule } from '@angular/platform-browser';

import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    HammerModule,
  ],
  declarations: [
    BookComponent,
    PageComponent,
    ReversePipe,
  ],
  exports: [
    BookComponent,
  ]
})
export class FlipBookModule {
  static forChild(): ModuleWithProviders<FlipBookModule> {
    return {
      ngModule: FlipBookModule,
      providers: [
        FlipbookService,
      ]
    };
  }
}
