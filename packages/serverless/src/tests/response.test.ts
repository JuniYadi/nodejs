import { setResponse } from "../response";

describe("setResponse", () => {
  test("should set response with default code and message", () => {
    const c = {
      status: jest.fn(),
      json: jest.fn(),
    };

    setResponse(c, {code: 200});

    expect(c.status).toHaveBeenCalledWith(200);
    expect(c.json).toHaveBeenCalledWith({
      code: 200,
      message: "success",
    });
  });

  test("should set response with provided code and message", () => {
    const c = {
      status: jest.fn(),
      json: jest.fn(),
    };

    setResponse(c, {
      code: 404,
      message: "Not Found",
    });

    expect(c.status).toHaveBeenCalledWith(404);
    expect(c.json).toHaveBeenCalledWith({
      code: 404,
      message: "Not Found",
      data: undefined,
      errors: undefined,
    });
  });

  test("should set response with provided data and errors", () => {
    const c = {
      status: jest.fn(),
      json: jest.fn(),
    };

    setResponse(c, {
      code: 500,
      data: { id: 1, name: "John" },
      errors: { message: "Internal Server Error" },
    });

    expect(c.status).toHaveBeenCalledWith(500);
    expect(c.json).toHaveBeenCalledWith({
      code: 500,
      message: "Internal Server Error",
      data: { id: 1, name: "John" },
      errors: { message: "Internal Server Error" },
    });
  });
});
