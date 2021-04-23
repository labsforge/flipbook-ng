# Simple plug and play FlipBook component

[![npm version](https://badge.fury.io/js/%40labsforge%2Fbookflip.svg)](https://badge.fury.io/js/%40labsforge%2Fbookflip)
![GitHub License](https://img.shields.io/badge/license-MIT-green.svg)

## Demo
<p align="center">
<img src ="https://github.com/labsforge/flipbook-ng/blob/master/Flip.gif" /></p>

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
      FlipBookModule.forRoot()
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

@Component({ /* ... */ })
export class MyComponent {
  book: Book = {
    width: 1000,
    height: 800,
    zoom: 1,
    pages: [
      'assets/demo/01-left.png',
      'assets/demo/01-right.png',
      'assets/demo/02-left.png',
      'assets/demo/02-right.png',
      'assets/demo/03-left.png',
      'assets/demo/03-right.png',
    ]
  }
}
```

## Further help

pull request always welcome!!!

## License

This project is licensed under the terms of the **[MIT](https://opensource.org/licenses/MIT) ** license.