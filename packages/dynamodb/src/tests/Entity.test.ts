import { Entity } from "../Entity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const model = {
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
};

const config = {
  client: client,
  table: "users",
};

describe("Entity", () => {
  it("should create an instance of Entity", () => {
    const entity = new Entity(model, config);

    expect(entity).toBeInstanceOf(Entity);
  });

  it("should running create method", async () => {
    const entity = new Entity(model, config);

    const input = {
      id: "123",
      name: "John Doe",
    };

    const result = await entity.create(input);

    expect(result).toEqual(input);
  });
});
