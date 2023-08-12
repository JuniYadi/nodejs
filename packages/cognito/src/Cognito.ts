import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordCommandOutput,
  AdminDisableUserCommand,
  AdminDisableUserCommandOutput,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandOutput,
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
}

export class Cognito {
  public region: string;
  public userPoolId: string;
  public clientId: string;
  public cognitoIdentityProvider: CognitoIdentityProviderClient;

  constructor(opts?: ICognito) {
    this.region = opts?.region || process.env.AWS_REGION || "";
    this.userPoolId =
      opts?.userPoolId || process.env.COGNITO_USER_POOL_ID || "";
    this.clientId = opts?.clientId || process.env.COGNITO_CLIENT_ID || "";

    this.cognitoIdentityProvider = new CognitoIdentityProviderClient({
      region: this.region,
    });
  }

  /**
   * Generate a random password of a given length
   * @param length
   * @returns string
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
        const changePassword = await this.changePassword(
          opts.email,
          opts.password
        );

        if (changePassword?.$metadata?.httpStatusCode !== 200) {
          throw new Error("Error changing password");
        }
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
}
