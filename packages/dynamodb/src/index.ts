interface DatabaseOptions {
  table: string;
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export class Database {
  public options: DatabaseOptions = {} as DatabaseOptions;

  constructor(options: DatabaseOptions) {
    // init table name
    if (options.table) {
      this.options.table = options.table;
    } else if (!options.table && process.env.DYNAMODB_TABLE) {
      this.options.table = process.env.DYNAMODB_TABLE;
    } else {
      throw new Error("No table name provided");
    }

    // init region
    if (options.region) {
      this.options.region = options.region;
    } else if (!options.region && process.env.AWS_REGION) {
      this.options.region = process.env.AWS_REGION;
    } else {
      throw new Error("No region provided");
    }
  }

  public async get(id: string) {
    return {};
  }

  public async query() {
    return {};
  }
}
