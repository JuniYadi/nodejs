import { logger } from "../index";

describe("logger", () => {
  describe("info", () => {
    it("should log the provided data at info level", () => {
      const log = new logger();
      const data = { message: "This is an info message" };

      expect(() => log.info(data)).not.toThrow();
    });
  });

  describe("error", () => {
    it("should log the provided data at error level", () => {
      const log = new logger();
      const data = { message: "This is an error message" };

      expect(() => log.error(data)).not.toThrow();
    });
  });

  describe("warn", () => {
    it("should log the provided data at warn level", () => {
      const log = new logger();
      const data = { message: "This is a warn message" };

      expect(() => log.warn(data)).not.toThrow();
    });
  });

  describe("debug", () => {
    it("should log the provided data at debug level", () => {
      const log = new logger();
      const data = { message: "This is a debug message" };

      expect(() => log.debug(data)).not.toThrow();
    });
  });

  describe("trace", () => {
    it("should log the provided data at trace level", () => {
      const log = new logger();
      const data = { message: "This is a trace message" };

      expect(() => log.trace(data)).not.toThrow();
    });
  });

  describe("parent", () => {
    it("should set the parent data", () => {
      const log = new logger();
      const data = { parent: "This is parent data" };

      log.parent(data);

      expect(log._parent).toEqual(data);
    });
  });
});
