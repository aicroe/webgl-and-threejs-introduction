export interface Pages {
  hasNext(): boolean;
  hasPrevious(): boolean;
  next(): void;
  previous(): void;
}
