import { Cognito, ICognitoInviteUser } from "../Cognito";
import {
  AdminCreateUserCommand,
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

  describe("inviteUser", () => {
    it("should call AdminCreateUserCommand with correct params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser: ICognitoInviteUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        autoConfirm: false,
        sendEmail: true,
      };

      const expectedParams = {
        UserPoolId: cognito.userPoolId,
        Username: mockUser.email,
        UserAttributes: [
          {
            Name: "email",
            Value: mockUser.email,
          },
          {
            Name: "name",
            Value: mockUser.name,
          },
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
        DesiredDeliveryMediums: ["EMAIL"],
        ForceAliasCreation: false,
        MessageAction: "RESEND",
        TemporaryPassword: expect.any(String),
      };

      await cognito.inviteUser(mockUser);

      expect(AdminCreateUserCommand).toHaveBeenCalledWith(expectedParams);
      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminCreateUserCommand)
      );
    });
  });
});
