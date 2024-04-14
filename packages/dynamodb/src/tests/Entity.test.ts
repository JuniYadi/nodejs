import { Entity } from "../Entity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const model = {
  model: {
    id: {
      type: "string",
      required: true,
    },
    name: {
      type: "string",
      required: false,
    },
  },
  indexs: {
    pk: {
      pk: {
        field: "pk",
        composite: ["id"],
      },
      sk: {
        field: "sk",
        composite: ["name"],
      },
    },
    createdAt: {
      index: "ls1Index",
      pk: {
        field: "pk",
        composite: ["id"],
      },
      sk: {
        field: "ls1sk",
        composite: ["createdAt"],
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

  it("should running query method", async () => {
    const entity = new Entity(model, config);

    const result = await entity.query.pk({ id: "test", name: "yeye" });
  });
});
