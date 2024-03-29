
import { DBOptions, ModelOptions } from "./types/Entity";

export class Entity {
  model: ModelOptions;
  config: DBOptions;

  constructor(model: ModelOptions, config: DBOptions) {
    this.model = model;
    this.config = config;
  }
}
