import { ElectroEvent } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const client = new DynamoDBClient({});

export const logger = (event: ElectroEvent) => {
  console.log(JSON.stringify(event, null, 4));
};