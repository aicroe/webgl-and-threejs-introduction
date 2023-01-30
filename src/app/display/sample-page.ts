export abstract class SamplePage {
  private next: SamplePage | null = null;
  private previous: SamplePage | null = null;

  abstract start(): void;
  abstract end(): void;

  getNext(): SamplePage | null {
    return this.next;
  }

  getPrevious(): SamplePage | null {
    return this.previous;
  }

  setNext(next: SamplePage): void {
    this.next = next;
    this.next.previous = this;
  }

  setPrevious(previous: SamplePage): void {
    this.previous = previous;
    this.previous.next = this;
  }
}

export class EmptySamplePage extends SamplePage {
  start(): void {}
  end(): void {}
}
