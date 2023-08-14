import { Cognito, ICognitoInviteUser } from "../index";
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

jest.mock("@aws-sdk/client-cognito-identity-provider");

describe("CognitoWithEnv", () => {
  let cognito: Cognito;

  beforeEach(() => {
    process.env.AWS_REGION = "us-west-2";
    process.env.COGNITO_USER_POOL_ID = "us-west-2_123456789";
    process.env.COGNITO_CLIENT_ID = "123456789";

    cognito = new Cognito();
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.AWS_REGION;
    delete process.env.COGNITO_USER_POOL_ID;
    delete process.env.COGNITO_CLIENT_ID;
  });

  describe("InitCognito", () => {
    it("Cognito should be initialized with env variables", async () => {
      expect(cognito).toBeDefined();
      expect(cognito.userPoolId).toEqual("us-west-2_123456789");
      expect(cognito.clientId).toEqual("123456789");
    });
  });
});

describe("CognitoNoEnv", () => {
  let cognito: Cognito;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("InitCognito", () => {
    it("Cognito should throw error if no env variables are set", async () => {
      expect(() => {
        cognito = new Cognito();
      }).toThrowError("AWS Region is required");

      expect(() => {
        cognito = new Cognito({
          region: "us-west-2",
        });
      }).toThrowError("Cognito User Pool ID is required");
      expect(() => {
        cognito = new Cognito({
          region: "us-west-2",
          userPoolId: "us-west-2_123456789",
        });
      }).toThrowError("Cognito Client ID is required");
    });
  });
});

describe("CognitoWithParams", () => {
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
    jest.resetAllMocks();
  });

  describe("InviteUser", () => {
    it("should call AdminCreateUserCommand with minimals params", async () => {
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

    it("should call AdminCreateUserCommand with autoConfirm params", async () => {
      const mockResponse = {
        User: {
          UserStatus: "FORCE_CHANGE_PASSWORD",
        },
      };
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser: ICognitoInviteUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        autoConfirm: true,
        sendEmail: false,
      };

      // mock changePassword
      cognito.changePassword = jest.fn();

      await cognito.inviteUser(mockUser);

      // make sure changePassword is called
      await expect(cognito.changePassword).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.password
      );
    });

    it("should call AdminCreateUserCommand without sending email", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser: ICognitoInviteUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        autoConfirm: false,
        sendEmail: false,
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
        MessageAction: "SUPPRESS",
        TemporaryPassword: expect.any(String),
      };

      await cognito.inviteUser(mockUser);

      expect(AdminCreateUserCommand).toHaveBeenCalledWith(expectedParams);
      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminCreateUserCommand)
      );
    });

    it("should call AdminCreateUserCommand with phoneNumber params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser: ICognitoInviteUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "+1234567890",
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
          {
            Name: "phone_number",
            Value: mockUser.phoneNumber,
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

    it("should call AdminCreateUserCommand with Additional Attributes", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser: ICognitoInviteUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        autoConfirm: false,
        sendEmail: false,
        attributes: [
          {
            Name: "Family Name",
            Value: "Doe",
          },
        ],
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
          {
            Name: "Family Name",
            Value: "Doe",
          },
        ],
        DesiredDeliveryMediums: ["EMAIL"],
        ForceAliasCreation: false,
        MessageAction: "SUPPRESS",
        TemporaryPassword: expect.any(String),
      };

      await cognito.inviteUser(mockUser);

      expect(AdminCreateUserCommand).toHaveBeenCalledWith(expectedParams);
      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminCreateUserCommand)
      );
    });

    it("should call AdminCreateUserCommand with Group params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser: ICognitoInviteUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        autoConfirm: true,
        sendEmail: false,
        group: "Admin",
      };

      // mock changePassword
      cognito.addUserToGroup = jest.fn();

      await cognito.inviteUser(mockUser);

      // make sure changePassword is called
      await expect(cognito.addUserToGroup).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.group
      );
    });

    it("should throw an error if the user already exists", async () => {
      (cognitoIdentityProvider.send as jest.Mock).mockRejectedValue(
        new Error("User already exists")
      );

      const mockUser: ICognitoInviteUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password",
        autoConfirm: true,
        sendEmail: false,
      };

      await expect(cognito.inviteUser(mockUser)).rejects.toThrow(
        "User already exists"
      );

      expect(AdminCreateUserCommand).toHaveBeenCalledWith(expect.anything());

      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminCreateUserCommand)
      );
    });
  });

  describe("RandomPassword", () => {
    it("should generate a random password of the given length", () => {
      const password = cognito.randomPassword(8);
      expect(password).toHaveLength(8);
    });

    it("should generate a 12-character password by default", () => {
      const password = cognito.randomPassword();
      expect(password).toHaveLength(12);
    });
  });

  describe("ChangePassword", () => {
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

  describe("DisableUser", () => {
    it("should call AdminDisableUserCommand with correct params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser = {
        email: "johndoe@example.com",
      };

      const expectedParams = {
        UserPoolId: cognito.userPoolId,
        Username: mockUser.email,
      };

      await cognito.disableUser(mockUser.email);

      expect(AdminDisableUserCommand).toHaveBeenCalledWith(expectedParams);

      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminDisableUserCommand)
      );
    });
  });

  describe("DeleteUser", () => {
    it("should call AdminDisableUserCommand and AdminDeleteUserCommand with correct params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser = {
        email: "johndoe@example.com",
      };

      const expectedParams = {
        UserPoolId: cognito.userPoolId,
        Username: mockUser.email,
      };

      await cognito.deleteUser(mockUser.email);

      expect(AdminDisableUserCommand).toHaveBeenCalledWith(expectedParams);

      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminDisableUserCommand)
      );

      expect(AdminDeleteUserCommand).toHaveBeenCalledWith(expectedParams);

      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminDeleteUserCommand)
      );
    });
  });

  describe("ListUsers", () => {
    it("should call ListUsersCommand with correct params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const expectedParams = {
        UserPoolId: cognito.userPoolId,
      };

      await cognito.listUsers();

      expect(ListUsersCommand).toHaveBeenCalledWith(expectedParams);

      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(ListUsersCommand)
      );
    });
  });

  describe("AddUserToGroup", () => {
    it("should call AdminAddUserToGroupCommand with correct params", async () => {
      const mockResponse = {};
      (cognitoIdentityProvider.send as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const mockUser = {
        email: "johndoe@example.com",
        group: "Admin",
      };

      const expectedParams = {
        UserPoolId: cognito.userPoolId,
        Username: mockUser.email,
        GroupName: mockUser.group,
      };

      await cognito.addUserToGroup(mockUser.email, mockUser.group);

      expect(AdminAddUserToGroupCommand).toHaveBeenCalledWith(expectedParams);

      expect(cognitoIdentityProvider.send).toHaveBeenCalledWith(
        expect.any(AdminAddUserToGroupCommand)
      );
    });
  });
});
