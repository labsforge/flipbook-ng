export interface Cover {
  front: string;
  back: string;
  backgroundColor?: string;
}

export enum PageType {
  Single,
  Double
}

export interface Book {
  width: number;
  height: number;
  zoom: number;
  cover?: Cover;
  pages: string[];
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
}
