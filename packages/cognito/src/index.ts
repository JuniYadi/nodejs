import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  AdminDisableUserCommand,
  AdminDeleteUserCommand,
  ListUsersCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type {
  AdminCreateUserCommandInput,
  AdminSetUserPasswordCommandOutput,
  AdminDisableUserCommandOutput,
  AdminDeleteUserCommandOutput,
  AdminAddUserToGroupCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { randomBytes } from "crypto";

export interface ICognito {
  region?: string;
  userPoolId?: string;
  clientId?: string;
}

export interface ICognitoAttributes {
  Name: string;
  Value: string;
}

export interface ICognitoInviteUser {
  name: string;
  email: string;
  password: string;
  passwordTemporary?: string;
  autoConfirm?: boolean;
  phoneNumber?: string;
  sendEmail?: boolean;
  attributes?: ICognitoAttributes[];
  group?: string;
}

export class Cognito {
  public region: string;
  public userPoolId: string;
  public clientId: string;
  public cognitoIdentityProvider: CognitoIdentityProviderClient;

  /**
   * Create a new Cognito instance
   * @param opts
   * @example
   * const cognito = new Cognito({
   *  region: "us-east-1",
   *  userPoolId: "us-east-1_123456789",
   *  clientId: "12345678901234567890",
   * });
   */
  constructor(opts?: ICognito) {
    this.region = opts?.region || process.env.AWS_REGION || "";
    this.userPoolId =
      opts?.userPoolId || process.env.COGNITO_USER_POOL_ID || "";
    this.clientId = opts?.clientId || process.env.COGNITO_CLIENT_ID || "";

    if (!this.region) throw new Error("AWS Region is required");
    if (!this.userPoolId) throw new Error("Cognito User Pool ID is required");
    if (!this.clientId) throw new Error("Cognito Client ID is required");

    this.cognitoIdentityProvider = new CognitoIdentityProviderClient({
      region: this.region,
    });
  }

  /**
   * Generate a random password of a given length
   * @param length
   * @returns string
   * @example
   * const password = randomPassword(12);
   * console.log(password);
   */
  public randomPassword = (length = 12): string => {
    return randomBytes(256).toString("hex").slice(0, length);
  };

  /**
   * Invite a user to the Cognito User Pool
   * @param opts
   */
  public inviteUser = async (opts: ICognitoInviteUser) => {
    const temporaryPassword = opts.passwordTemporary || this.randomPassword();

    const items: AdminCreateUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: opts.email,
      UserAttributes: [
        {
          Name: "email",
          Value: opts.email,
        },
        {
          Name: "name",
          Value: opts.name,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      DesiredDeliveryMediums: ["EMAIL"],
      ForceAliasCreation: false,
      MessageAction: opts.sendEmail ? "RESEND" : "SUPPRESS",
      TemporaryPassword: temporaryPassword,
    };

    // Add Phone Number to User Attributes if provided
    if (opts.phoneNumber && items.UserAttributes) {
      items.UserAttributes.push({
        Name: "phone_number",
        Value: opts.phoneNumber,
      });
    }

    // Add Other Attributes to User Attributes if provided
    if (opts.attributes && items.UserAttributes) {
      items.UserAttributes = items.UserAttributes.concat(opts.attributes);
    }

    const command = new AdminCreateUserCommand(items);
    try {
      const response = await this.cognitoIdentityProvider.send(command);

      /**
       * If the user is FORCE_CHANGE_PASSWORD, then change the password to the one provided
       * So that the user can login with the password provided
       */
      if (
        opts.autoConfirm &&
        response?.User?.UserStatus === "FORCE_CHANGE_PASSWORD"
      ) {
        await this.changePassword(opts.email, opts.password);
      }

      /**
       * Add the user to the group if provided
       */
      if (opts.group) {
        await this.addUserToGroup(opts.email, opts.group);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Change user password in Cognito User Pool
   * @param username - Username of the user
   * @param password - New password for the user
   * @returns Promise<AdminSetUserPasswordCommandOutput>
   * @example
   * const cognito = new Cognito();
   * const users = await cognito.changePassword("johndoe@example.com", "newPassword");
   * console.log(users.Users);
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminSetUserPassword.html
   */
  public changePassword = async (
    username: string,
    password: string
  ): Promise<AdminSetUserPasswordCommandOutput> => {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Password: password,
      Permanent: true,
    });

    return this.cognitoIdentityProvider.send(command);
  };

  /**
   * Disable a user in Cognito User Pool
   * @param username - Username of the user
   * @returns Promise<AdminDisableUserCommandOutput>
   * @example
   * const cognito = new Cognito();
   * const users = await cognito.disableUser("johndoe@example.com");
   * console.log(users.Users);
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminDisableUser.html
   */
  public disableUser = async (
    username: string
  ): Promise<AdminDisableUserCommandOutput> => {
    const command = new AdminDisableUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    return this.cognitoIdentityProvider.send(command);
  };

  /**
   * Delete a user in Cognito User Pool
   * @param username - Username of the user
   * @returns Promise<AdminDeleteUserCommandOutput>
   * @example
   * const cognito = new Cognito();
   * const users = await cognito.deleteUser("johndoe@example.com");
   * console.log(users.Users);
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminDeleteUser.html
   */
  public deleteUser = async (
    username: string
  ): Promise<AdminDeleteUserCommandOutput> => {
    // Disable the user first
    await this.disableUser(username);

    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    return this.cognitoIdentityProvider.send(command);
  };

  /**
   * List for users in Cognito User Pool
   * @param opts
   * @returns Promise<ListUsersCommandOutput>
   * @example
   * const cognito = new Cognito();
   * const users = await cognito.listUsers({ email: "johndoe@example.com" });
   * console.log(users.Users);
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsers.html
   */
  public listUsers = async (filter?: string) => {
    const command = new ListUsersCommand({
      UserPoolId: this.userPoolId,
      Filter: filter || undefined,
    });

    return this.cognitoIdentityProvider.send(command);
  };

  /**
   * Add a user to a group in Cognito User Pool
   * @param username - Username of the user
   * @param groupName - Name of the group
   * @returns Promise<AdminAddUserToGroupCommandOutput>
   * @example
   * const cognito = new Cognito();
   * const users = await cognito.addUserToGroup("johndoe@example.com", "Admin");
   * console.log(users.Users);
   *
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminAddUserToGroup.html
   */
  public addUserToGroup = async (
    username: string,
    groupName: string
  ): Promise<AdminAddUserToGroupCommandOutput> => {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      GroupName: groupName,
    });

    return this.cognitoIdentityProvider.send(command);
  };
}
