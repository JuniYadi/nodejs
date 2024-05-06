import { app } from "../hono";
import { handle } from "hono/aws-lambda"

app.get("/", (c) => {
  return c.text("Hello, World!");
});

const handler = handle(app);

describe("Hono", () => {
  it("Running", async () => {
    const req = await app.request("/");
    expect(req.status).toBe(200);
    expect(req.body).toBe("Hello, World!");
  });
});
