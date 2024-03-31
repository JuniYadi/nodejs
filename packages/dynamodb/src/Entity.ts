import type {
  InputModelType,
  DBOptions,
  Indexs,
  ModelOptions,
  Models,
} from "./types/Entity";

export class Entity<M extends Models, I extends Indexs> {
  model: M;
  index: I;
  config: DBOptions;

  constructor(schema: ModelOptions, config: DBOptions) {
    this.model = schema.model as M;
    this.index = schema.indexs as I;
    this.config = config;
  }

  public async create(input: InputModelType<M>): Promise<InputModelType<M>> {
    return input;
  }
}
