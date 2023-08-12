import { Cognito } from "../Cognito";
import {
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

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

  describe("changePassword", () => {
    it("should call AdminChangeUserPasswordCommand with correct params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser = {
        email: "johndoe@example.com",
        password: "password",
      };

      const expectedParams = {
        UserPoolId: cognito.userPoolId,
        Username: mockUser.email,
        Password: mockUser.password,
        Permanent: true,
      };

      await cognito.changePassword(mockUser.email, mockUser.password);

      expect(AdminSetUserPasswordCommand).toHaveBeenCalledWith(expectedParams);

      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminSetUserPasswordCommand)
      );
    });
  });
});
