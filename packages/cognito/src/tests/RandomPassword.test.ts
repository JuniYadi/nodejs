import { Cognito } from "../Cognito";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

jest.mock("@aws-sdk/client-cognito-identity-provider");

describe("Cognito", () => {
  let cognito: Cognito;
  let cognitoIdentityProvider: CognitoIdentityProviderClient;

  beforeEach(() => {
    cognitoIdentityProvider = new CognitoIdentityProviderClient({});
    cognito = new Cognito({
      region: "us-west-2",
      userPoolId: "us-west-2_123456789",
      clientId: "123456789",
    });
    (CognitoIdentityProviderClient as jest.Mock).mockImplementation(() => {
      return {
        send: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("randomPassword", () => {
    it("should generate a random password of the given length", () => {
      const password = cognito.randomPassword(8);
      expect(password).toHaveLength(8);
    });

    it("should generate a 12-character password by default", () => {
      const password = cognito.randomPassword();
      expect(password).toHaveLength(12);
    });
  });
});
