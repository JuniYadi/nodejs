import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

interface DatabaseOptions {
  tableName: string;
  region: string;
  endpoint?: string;
}

export class Database {
  static options: DatabaseOptions = {} as DatabaseOptions;
  static client: DynamoDBDocumentClient;

  pk: string = "";

  /**
   * This is the list containing the where clauses
   * @type {string[]}
   * @memberof Database
   * @static
   * @example
   * Database.where("id = 1");
   * Database.where("name = 'John'");
   */
  static whereData: string[] = [];

  /**
   * This is the limit clause
   * @type {number}
   * @memberof Database
   * @static
   * @example
   * Database.limit(10);
   * Database.limit(20);
   */
  static limitData: number = 15;

  constructor(options: DatabaseOptions) {
    // init table name
    if (options.tableName) {
      Database.options.tableName = options.tableName;
    } else if (!options.tableName && process.env.DYNAMODB_TABLE) {
      Database.options.tableName = process.env.DYNAMODB_TABLE;
    } else {
      throw new Error("No table name provided");
    }

    // init region
    if (options.region) {
      Database.options.region = options.region;
    } else if (!options.region && process.env.AWS_REGION) {
      Database.options.region = process.env.AWS_REGION;
    } else {
      throw new Error("No region provided");
    }

    // init dynamodb client
    const ddb = new DynamoDBClient({
      region: Database.options.region,
      endpoint: options.endpoint || undefined,
    });

    Database.client = DynamoDBDocumentClient.from(ddb);
  }

  public static where(val: string) {
    this.whereData.push(val);
  }

  public static limit(val: number) {
    this.limitData = val;
  }

  setPk(val: string) {
    this.pk = val;
  }

  getPk() {
    return this.pk;
  }

  public static async get(id: string) {
    return {};
  }

  public static async query() {
    const commands = new QueryCommand({
      TableName: this.options.tableName,
      KeyConditionExpression: ":pk = #pk",
      ExpressionAttributeNames: {
        ":pk": "pk",
      },
      ExpressionAttributeValues: {
        "#pk": "pk",
      },
      Limit: Database.limitData,
    });

    return this.client.send(commands);
  }
}
