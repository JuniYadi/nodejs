import { p, now } from "../logger";

describe("Logger", () => {
  it("should print a date", () => {
    const date = now();

    expect(date).toBeDefined();
  });

  it("should print a log", () => {
    expect(() => {
      p.info("test");
    }).not.toThrow();
  });
});
