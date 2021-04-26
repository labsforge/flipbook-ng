export interface Cover {
  front: string;
  back: string;
}

export interface Book {
  width: number;
  height: number;
  zoom: number;
  cover?: Cover;
  pages: string[];
  pageWidth?: number;
  pageHeight?: number;
  startPageType?: number;
  endPageType?: number;
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
