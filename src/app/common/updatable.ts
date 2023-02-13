export interface UpdateParams {
  elapsed: number;
  delta: number;
}

export interface Updatable {
  update(params: UpdateParams): void;
}
