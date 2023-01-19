export interface UpdateParams {
  timestamp: number;
  elapsed: number;
}

export interface Updatable {
  update(params: UpdateParams): void;
}
