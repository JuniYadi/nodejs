import { generate } from "../index";

describe("generate", () => {
  const expectLowercase = expect.stringMatching(/[a-z]/);
  const expectUppercase = expect.stringMatching(/[A-Z]/);
  const expectNumbers = expect.stringMatching(/[0-9]/);
  const expectSymbols = expect.stringMatching(
    /[!@#$%^&*()_+~`|}{[\]:;?><,.\/-=]/
  );

  it("should throw error if options is negative value", () => {
    expect(() => {
      generate(8, { lowercase: -1 });
    }).toThrow(new Error("Number of characters cannot be negative."));
  });

  it("should throw error if total length is smaller than the required characters", () => {
    expect(() => {
      generate(8, { lowercase: 8, uppercase: 8 });
    }).toThrow(
      new Error("Total length is smaller than the required characters.")
    );
  });

  it("should generate a random password with default length and options", () => {
    const password = generate();
    expect(password).toHaveLength(8);
    expect(password).toContainEqual(expectLowercase);
  });

  it("should generate a random password with specified length and options", () => {
    const password = generate(16, {
      lowercase: 2,
      uppercase: 2,
      numbers: 2,
      symbols: 2,
    });

    expect(password).toHaveLength(16);
    expect(password).toContainEqual(expectLowercase);
    expect(password).toContainEqual(expectUppercase);
    expect(password).toContainEqual(expectNumbers);
    expect(password).toContainEqual(expectSymbols);
  });

  it("should generate a random password with only lowercase letters", () => {
    const password = generate(8, { lowercase: true });
    expect(password).toHaveLength(8);
    expect(password).toContainEqual(expectLowercase);
    expect(password).not.toContainEqual(expectUppercase);
    expect(password).not.toContainEqual(expectNumbers);
    expect(password).not.toContainEqual(expectSymbols);
  });

  it("should generate a random password with lowercase and uppercase letters", () => {
    const password = generate(8, { uppercase: true });
    expect(password).toHaveLength(8);
    expect(password).toContainEqual(expectLowercase);
    expect(password).toContainEqual(expectUppercase);

    expect(password).not.toContainEqual(expectNumbers);
    expect(password).not.toContainEqual(expectSymbols);
  });

  it("should generate a random password with lowercase and number letters", () => {
    const password = generate(8, { numbers: true });
    expect(password).toHaveLength(8);
    expect(password).toContainEqual(expectLowercase);
    expect(password).toContainEqual(expectNumbers);

    expect(password).not.toContainEqual(expectUppercase);
    expect(password).not.toContainEqual(/[!@#$%^&*()_+~`|}{[\]:;?><,.\/-=]/);
  });

  it("should generate a random password with lowercase and symbols letters", () => {
    const password = generate(8, { symbols: true });
    expect(password).toHaveLength(8);
    expect(password).toContainEqual(expectLowercase);
    expect(password).toContainEqual(expectSymbols);

    expect(password).not.toContainEqual(expectUppercase);
    expect(password).not.toContainEqual(expectNumbers);
  });
});
