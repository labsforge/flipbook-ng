import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BookComponent } from './book/book.component';
import { PageComponent } from './page/page.component';
import { FlipbookService } from './flipbook.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BookComponent,
    PageComponent,
  ],
  exports: [
    BookComponent,
  ]
})
export class FlipBookModule {
  static forRoot(): ModuleWithProviders<FlipBookModule> {
    return {
      ngModule: FlipBookModule,
      providers: [
        FlipbookService,
      ]
    };
  }
}
