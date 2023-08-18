import { Cloudfront } from "../index";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import dayjs from "dayjs";

jest.mock("@aws-sdk/cloudfront-signer");

describe("Cloudfront", () => {
  const privateKey = "privateKey";
  const publicKeyId = "publicKeyId";
  const domain = "domain";
  const filename = "test.jpg";
  const userId = "123456";
  const exp = 30;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should throw an error if cloudFrontPrivateKey is not provided", () => {
      expect(
        () =>
          new Cloudfront({
            cloudFrontPublicKeyId: publicKeyId,
            cloudFrontDomain: domain,
          })
      ).toThrow("cloudFrontPrivateKey is required");
    });

    it("should throw an error if cloudFrontPublicKeyId is not provided", () => {
      expect(
        () =>
          new Cloudfront({
            cloudFrontPrivateKey: privateKey,
            cloudFrontDomain: domain,
          })
      ).toThrow("cloudFrontPublicKeyId is required");
    });

    it("should throw an error if cloudFrontDomain is not provided", () => {
      expect(
        () =>
          new Cloudfront({
            cloudFrontPrivateKey: privateKey,
            cloudFrontPublicKeyId: publicKeyId,
          })
      ).toThrow("cloudFrontDomain is required");
    });

    it("should set the properties correctly if all options are provided", () => {
      const cloudfront = new Cloudfront({
        cloudFrontPrivateKey: privateKey,
        cloudFrontPublicKeyId: publicKeyId,
        cloudFrontDomain: domain,
      });
      expect(cloudfront["cloudFrontPrivateKey"]).toBe(privateKey);
      expect(cloudfront["cloudFrontPublicKeyId"]).toBe(publicKeyId);
      expect(cloudfront["cloudFrontDomain"]).toBe(domain);
    });

    it("should set throw an error if cloudFrontPrivateKey if not provided", () => {
      expect(
        () =>
          new Cloudfront({
            cloudFrontPublicKeyId: publicKeyId,
            cloudFrontDomain: domain,
          })
      ).toThrow("cloudFrontPrivateKey is required");
    });
  });

  describe("generateUrl", () => {
    it("should call getSignedUrl with correct parameters", () => {
      const cloudfront = new Cloudfront({
        cloudFrontPrivateKey: privateKey,
        cloudFrontPublicKeyId: publicKeyId,
        cloudFrontDomain: domain,
      });
      const url = `${domain}/${filename}`;
      // expected same date and time but with milliseconds removed
      const expectedExpired = dayjs()
        .add(15, "minute")
        .toISOString()
        .split(".")[0];
      const expectedUrlUpload = "signedUrl";
      (getSignedUrl as jest.Mock).mockReturnValueOnce(expectedUrlUpload);

      const result = cloudfront.generateUrl(filename);

      expect(getSignedUrl).toHaveBeenCalledWith({
        url,
        keyPairId: publicKeyId,
        dateLessThan: expect.stringContaining(expectedExpired),
        privateKey,
      });
      expect(result).toEqual({
        urlUpload: expectedUrlUpload,
        url,
        filename,
        path: filename,
      });
    });

    it("should call getSignedUrl with custom expiration time", () => {
      const cloudfront = new Cloudfront({
        cloudFrontPrivateKey: privateKey,
        cloudFrontPublicKeyId: publicKeyId,
        cloudFrontDomain: domain,
      });
      const url = `${domain}/${filename}`;
      // expected same date and time but with milliseconds removed
      const expectedExpired = dayjs()
        .add(exp, "minute")
        .toISOString()
        .split(".")[0];
      const expectedUrlUpload = "signedUrl";
      (getSignedUrl as jest.Mock).mockReturnValueOnce(expectedUrlUpload);

      const result = cloudfront.generateUrl(filename, exp);

      expect(getSignedUrl).toHaveBeenCalledWith({
        url,
        keyPairId: publicKeyId,
        dateLessThan: expect.stringContaining(expectedExpired),
        privateKey,
      });
      expect(result).toEqual({
        urlUpload: expectedUrlUpload,
        url,
        filename,
        path: filename,
      });
    });
  });

  describe("generateUserUploadUrl", () => {
    it("should call generateUrl with correct parameters", () => {
      const cloudfront = new Cloudfront({
        cloudFrontPrivateKey: privateKey,
        cloudFrontPublicKeyId: publicKeyId,
        cloudFrontDomain: domain,
      });
      const date = dayjs();
      const year = date.year();
      const month = date.format("MM");
      const timestamp = date.unix();
      const newFilename = `${timestamp}-${filename}`;
      const url = `${userId}/${year}/${month}/${newFilename}`;
      const expectedUrlUpload = "signedUrl";

      const generateUrlSpy = jest.spyOn(cloudfront, "generateUrl");
      generateUrlSpy.mockReturnValueOnce({
        urlUpload: expectedUrlUpload,
        url,
        filename: newFilename,
        path: url,
      });

      const result = cloudfront.generateUserUploadUrl(filename, userId);

      expect(cloudfront.generateUrl).toHaveBeenCalledWith(url, undefined);
      expect(result).toEqual({
        urlUpload: expectedUrlUpload,
        url,
        filename: newFilename,
        path: url,
      });
    });
  });
});
