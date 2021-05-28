# Simple plug and play FlipBook component

[![npm version](https://badge.fury.io/js/%40labsforge%2Fbookflip.svg)](https://badge.fury.io/js/%40labsforge%2Fbookflip)
![GitHub License](https://img.shields.io/badge/license-MIT-green.svg)

## Demo
<p align="center">
<img src ="https://github.com/labsforge/flipbook-ng/blob/master/projects/flipbook-lib/flipbook_demo.gif" /></p>

## Install it with npm
npm install @labsforge/flipbook --save

## Interfaces
```typescript
interface Cover {
  front: BookPageSide;
  back: BookPageSide;
}

enum PageType {
  Single,
  Double
}

interface BookPageSide {
  imageUrl: string;
  backgroundColor?: string;
  opacity?: number;
}

interface Book {
  width: number;
  height: number;
  zoom: number;
  cover?: Cover;
  pages: BookPageSide[];
  pageWidth?: number;
  pageHeight?: number;
  startPageType?: PageType;
  endPageType?: PageType;
}
```

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
  }
}
```

## Further help

pull request always welcome!!!

## License

This project is licensed under the terms of the **[MIT](https://opensource.org/licenses/MIT) ** license.