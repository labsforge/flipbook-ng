# Simple plug and play FlipBook component

[![npm version](https://badge.fury.io/js/%40labsforge%2Fbookflip.svg)](https://badge.fury.io/js/%40labsforge%2Fbookflip)
![GitHub License](https://img.shields.io/badge/license-MIT-green.svg)

## Demo
<p align="center">
<img src ="https://github.com/labsforge/flipbook-ng/blob/master/projects/flipbook-lib/flipbook_demo.gif" /></p>

## Install it with npm
npm install @labsforge/flipbook --save

## Usage
### Import the FlipBook Module in your app.module.ts file
```html
  import { FlipBookModule } from '@labsforge/flipbook';
  // other imports 
  
  @NgModule({
    imports: [
      // other imports 
      FlipBookModule
    ],
    // ...
  })
  export class AppModule {}

```
### Add selector in template file my-component.html

```html
  <flipbook [model]="book" [startAt]="2"></flipbook>
```

```typescript
import { Component } from '@angular/core';
import { Book } from '@labsforge/flipbook';

@Component({ /* ... */ })
export class MyComponent {
  book: Book = {
    width: 1190, // When cover is set, should match the cover size
    height: 800,
    zoom: 1,
    cover: { // optional
      front: 'assets/demo/02-right.png',
      back: 'assets/demo/02-left.png',
    },
    pages: [
      'assets/demo/01-left.png', // first single-page when startPageType: PageType.Single
      'assets/demo/03-left.png',
      'assets/demo/03-right.png',
      'assets/demo/04-left.png',
      'assets/demo/04-right.png',
      'assets/demo/05-left.png',
      'assets/demo/05-right.png',
      'assets/demo/06-left.png',
      'assets/demo/06-right.png',
      'assets/demo/01-right.png', // last single-page when endPageType: PageType.Single
    ],
    pageWidth: 595, // When smaller than cover
    pageHeight: 800,
    startPageType: PageType.Single, // optional
    endPageType: PageType.Single // optional
  }
}
```

## Further help

pull request always welcome!!!

## License

This project is licensed under the terms of the **[MIT](https://opensource.org/licenses/MIT) ** license.