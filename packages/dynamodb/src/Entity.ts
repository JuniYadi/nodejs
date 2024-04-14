import type {
  InputModelType,
  DBOptions,
  Indexs,
  ModelOptions,
  Models,
} from "./types/Entity";
import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

type CompositeFields<T> = T extends { composite: infer U }
  ? U extends (infer V)[]
    ? V
    : never
  : never;

export class Entity<M extends Models, I extends Indexs> {
  model: M;
  index: I;
  config: DBOptions;
  public query: {
    [K in keyof I]: (params: {
      [P in CompositeFields<I[K]["pk"]> | CompositeFields<I[K]["sk"]>]: string;
    }) => Promise<any>;
  };

  constructor(schema: ModelOptions, config: DBOptions) {
    this.model = schema.model as M;
    this.index = schema.indexs as I;
    this.config = config;

    // Initialize query object
    this.query = {};

    // Create a query function for each index
    for (const indexKey in this.index) {
      this.query[indexKey] = async (params) => {
        const index = this.index[indexKey];
        const { pk, sk } = index;

        // Generate KeyConditionExpression and ExpressionAttributeValues based on composite fields
        const pkCondition = `${pk.field} = ${pk.composite
          .map((_, i) => `:pkVal${i}`)
          .join(" and ")}`;
        const skCondition = `${sk.field} = ${sk.composite
          .map((_, i) => `:skVal${i}`)
          .join(" and ")}`;
        const keyConditionExpression = `${pkCondition} and ${skCondition}`;

        const expressionAttributeValues = marshall(
          pk.composite.reduce(
            (acc, field, i) => ({ ...acc, [`:pkVal${i}`]: params[field] }),
            {}
          ),
          sk.composite.reduce(
            (acc, field, i) => ({ ...acc, [`:skVal${i}`]: params[field] }),
            {}
          )
        );

        const queryInput: QueryCommandInput = {
          TableName: this.config.table,
          IndexName: index.index,
          KeyConditionExpression: keyConditionExpression,
          ExpressionAttributeValues: expressionAttributeValues,
        };

        // const command = new QueryCommand(queryInput);
        // const response = await this.config.client.send(command);

        // return response.Items;

        return queryInput;
      };
    }
  }

  public async create(input: InputModelType<M>): Promise<InputModelType<M>> {
    return input;
  }
}
