import { String } from "../decorator/String";

describe("String decorator", () => {
  it('should log "String", target, and propertyKey to the console', () => {
    const consoleSpy = jest.spyOn(console, "log");
    const target = {};
    const propertyKey = "testProperty";

    String()(target, propertyKey);

    expect(consoleSpy).toHaveBeenCalledWith("String", target, propertyKey);
  });
});
