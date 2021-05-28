export interface Cover {
  front: BookPageSide;
  back: BookPageSide;
}

export enum PageType {
  Single,
  Double
}

export interface BookPageSide {
  imageUrl: string;
  backgroundColor?: string;
  opacity?: number;
}

export interface Book {
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

export interface Page {
  index: number;
  front: PageSide;
  back: PageSide;
  rotation: number;
  lock?: boolean;
}

export interface PageSide {
  imageUrl: string;
  backgroundColor?: string;
  isCover?: boolean;
  width?: number;
  height?: number;
  opacity?: number;
}
