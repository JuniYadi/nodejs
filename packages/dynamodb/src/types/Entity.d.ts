import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export interface ModelOptions {
  model: Models;
  indexs: Indexs;
}

export interface Models {
  [key: string]: ModelAttributes;
}

export interface ModelAttributes {
  type:
    | "number"
    | "string"
    | "boolean"
    | "array"
    | "object"
    | "date"
    | "timestamp"
    | any;
  required: boolean;
}

export interface Indexs {
  [key: string]: ModelIndexOptions;
}

export interface ModelIndexOptions {
  index?: string;
  pk: IndexKeyDefinition;
  sk: IndexKeyDefinition;
}

export interface IndexKeyDefinition {
  /**
   * Field That Created For Index
   */
  field: string;

  /**
   * Set Index composite
   * @example
   * {
   *   composite: ["id"]
   * }
   *
   * This example will make composite with first value is BLOG
   * And second value is slug from attribute
   * Example: BLOG#this-is-your-slug
   * Example: BLOG#your-slug
   * @example
   * {
   *  composite: [
   *   {
   *    value: "BLOG"
   *   },
   *   {
   *    value: "slug",
   *    isAttribute: true
   *   },
   *  ]
   * }
   */
  composite: string[] | ModelIndexComposite[];
}

export interface ModelIndexComposite {
  /**
   * If true, value using from attribute
   * @type {boolean}
   */
  isAttribute?: boolean;

  /**
   * Set composite value
   * If isAttribute is true, value is attribute name
   * @example
   * {
   *  value: "slug",
   *  isAttribute: true
   * }
   *
   *
   * @type {string}
   */
  value: string;
}

export interface DBOptions {
  client: DynamoDBDocumentClient;
  table: string;
  logger?: any;
}
