import { logger } from "../logger";

describe("Logger", () => {
  it("should return a logger instance", () => {
    const log = logger();
    expect(log).toBeDefined();
  });

  it("should print a info log", () => {
    const log = logger();
    log.info("info");

    expect(log).toBeDefined();
  });
});
