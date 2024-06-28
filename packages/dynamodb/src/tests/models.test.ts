import { client } from "../models";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

describe("client", () => {
  it("should be an instance of DynamoDBClient", () => {
    expect(client).toBeInstanceOf(DynamoDBClient);
  });
});
