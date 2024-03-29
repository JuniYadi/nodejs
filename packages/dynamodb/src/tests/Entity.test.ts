import { Entity } from "../Entity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

describe("Entity", () => {
  it("should create an instance of Entity", () => {
    const entity = new Entity(
      {
        model: {
          User: {
            type: "object",
            required: true,
          },
        },
        indexs: {
          pk: {
            pk: {
              field: "id",
              composite: ["id"],
            },
            sk: {
              field: "id",
              composite: ["id"],
            },
          },
          createdAt: {
            index: "ls1sk",
            pk: {
              field: "createdAt",
              composite: [
                {
                  value: "slug",
                  isAttribute: true,
                },
                {
                  value: "MESSAGES",
                },
              ],
            },
            sk: {
              field: "updatedAt",
              composite: [
                {
                  value: "slug",
                  isAttribute: true,
                },
                {
                  value: "MESSAGES",
                },
              ],
            },
          },
        },
      },
      {
        client: client,
        table: "users",
      }
    );

    expect(entity).toBeInstanceOf(Entity);
  });
});
