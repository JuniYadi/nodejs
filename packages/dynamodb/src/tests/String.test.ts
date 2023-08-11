import { String } from "../decorator/String";

describe("String decorator", () => {
  class TestClass {
    @String()
    public name: string;
  }

  it('should log "String" with the target and property key', () => {
    const consoleSpy = jest.spyOn(console, "log");
    const testInstance = new TestClass();
    expect(consoleSpy).toHaveBeenCalledWith("String", testInstance, "name");
  });
});
