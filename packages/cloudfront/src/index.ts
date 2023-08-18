import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import dayjs from "dayjs";

export interface ICloudfront {
  cloudFrontPrivateKey?: string;
  cloudFrontPublicKeyId?: string;
  cloudFrontDomain?: string;
}

export class Cloudfront {
  private cloudFrontPrivateKey: string;
  private cloudFrontPublicKeyId: string;
  private cloudFrontDomain: string;

  constructor(opts?: ICloudfront) {
    this.cloudFrontPrivateKey =
      opts?.cloudFrontPrivateKey || process.env.CLOUDFRONT_PRIVATE_KEY || "";
    this.cloudFrontPublicKeyId =
      opts?.cloudFrontPublicKeyId || process.env.CLOUDFRONT_PUBLIC_KEY_ID || "";
    this.cloudFrontDomain =
      opts?.cloudFrontDomain || process.env.CLOUDFRONT_DOMAIN || "";

    if (!this.cloudFrontPrivateKey)
      throw new Error("cloudFrontPrivateKey is required");
    if (!this.cloudFrontPublicKeyId)
      throw new Error("cloudFrontPublicKeyId is required");
    if (!this.cloudFrontDomain) throw new Error("cloudFrontDomain is required");
  }

  /**
   * Generate url for file to cloudfront with raw url
   * @param filename
   * @param exp
   * @returns { urlUpload, url, filename }
   * @example
   * const { urlUpload, url, filename } = cloudfront.generateUrl("test.jpg");
   * console.log(urlUpload, url, filename);
   */
  public generateUrl = (filename: string, exp?: number) => {
    const url = `${this.cloudFrontDomain}/${filename}`;
    let expired = dayjs().add(15, "minute").toISOString();

    if (exp) {
      expired = dayjs().add(exp, "minute").toISOString();
    }

    const urlUpload = getSignedUrl({
      url,
      keyPairId: this.cloudFrontPublicKeyId,
      dateLessThan: expired,
      privateKey: this.cloudFrontPrivateKey,
    });

    return { urlUpload, url, filename };
  };

  /**
   * Generate url for file to cloudfront with user id
   * @param filename
   * @param userId
   * @param exp
   * @returns { urlUpload, url, filename }
   * @example
   * const { urlUpload, url, filename } = cloudfront.generateUserUploadUrl(
   *  "test.jpg",
   *  "123456"
   * );
   *
   * console.log(urlUpload, url, filename);
   */
  public generateUserUploadUrl = (
    filename: string,
    userId: string,
    exp?: number
  ) => {
    const date = dayjs();
    const year = date.year();
    const month = date.month() + 1;
    const timestamp = date.unix();

    const newFilename = `${timestamp}-${filename}`;
    const url = `${userId}/${year}/${month}/${newFilename}`;

    return this.generateUrl(url, exp);
  };
}
