export interface Node {
  setNext(next: Node): void;
  setPrevious(previous: Node): void;
}

export function connectNodes<T extends Node>(head: T, ...tail: T[]): T {
  tail.reduce((previous, current) => {
    previous.setNext(current);
    return current;
  }, head);

  return head;
}
