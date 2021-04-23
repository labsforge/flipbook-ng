export interface Book {
  width: number;
  height: number;
  zoom: number;
  pages: string[];
  startPageType?: number;
  endPageType?: number;
}

export interface Page {
  index: number;
  front: string;
  back: string;
  rotation: number;
  lock?: boolean;
}
