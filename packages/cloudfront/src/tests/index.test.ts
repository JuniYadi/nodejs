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

    it("should extract the filename correctly if it contains a path", () => {
      const cloudfront = new Cloudfront({
        cloudFrontPrivateKey: privateKey,
        cloudFrontPublicKeyId: publicKeyId,
        cloudFrontDomain: domain,
      });
      const url = `${domain}/path/${filename}`;
      // expected same date and time but with milliseconds removed
      const expectedExpired = dayjs()
        .add(15, "minute")
        .toISOString()
        .split(".")[0];
      const signedUrl = "signedUrl";
      const expectedUrl = {
        urlUpload: signedUrl,
        url,
        filename,
        path: "path/test.jpg",
      };

      (getSignedUrl as jest.Mock).mockReturnValue(signedUrl);

      const result = cloudfront.generateUrl("path/test.jpg");

      expect(getSignedUrl).toHaveBeenCalledWith({
        url,
        keyPairId: publicKeyId,
        dateLessThan: expect.stringContaining(expectedExpired),
        privateKey,
      });
      expect(result).toEqual(expectedUrl);
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
    it("should call generateUrl with the correct parameters and return the expected result", () => {
      const cloudfront = new Cloudfront({
        cloudFrontPrivateKey: privateKey,
        cloudFrontPublicKeyId: publicKeyId,
        cloudFrontDomain: domain,
      });
      const date = dayjs();
      const year = date.year();
      const month = date.format("MM");
      const url = `${userId}/${year}/${month}/test.jpg`;
      // expected same date and time but with milliseconds removed
      const expectedExpired = dayjs()
        .add(15, "minute")
        .toISOString()
        .split(".")[0];
      const signedUrl = "signedUrl";

      (getSignedUrl as jest.Mock).mockReturnValue(signedUrl);

      const result = cloudfront.generateUserUploadUrl(filename, userId);

      expect(getSignedUrl).toHaveBeenCalledWith({
        url: expect.stringContaining("test.jpg"),
        keyPairId: publicKeyId,
        dateLessThan: expect.stringContaining(expectedExpired),
        privateKey,
      });
      expect(result).toEqual({
        urlUpload: signedUrl,
        url: expect.stringContaining("test.jpg"),
        filename: expect.stringContaining("test.jpg"),
        path: expect.stringContaining("test.jpg"),
      });
    });

    it("should call generateUrl with the correct parameters and return the expected result when exp is provided", () => {
      const cloudfront = new Cloudfront({
        cloudFrontPrivateKey: privateKey,
        cloudFrontPublicKeyId: publicKeyId,
        cloudFrontDomain: domain,
      });
      const date = dayjs();
      const year = date.year();
      const month = date.format("MM");
      const url = `${userId}/${year}/${month}/test.jpg`;
      // expected same date and time but with milliseconds removed
      const expectedExpired = dayjs()
        .add(exp, "minute")
        .toISOString()
        .split(".")[0];
      const signedUrl = "signedUrl";

      (getSignedUrl as jest.Mock).mockReturnValue(signedUrl);

      const result = cloudfront.generateUserUploadUrl(filename, userId, exp);

      expect(getSignedUrl).toHaveBeenCalledWith({
        url: expect.stringContaining("test.jpg"),
        keyPairId: publicKeyId,
        dateLessThan: expect.stringContaining(expectedExpired),
        privateKey,
      });
      expect(result).toEqual({
        urlUpload: signedUrl,
        url: expect.stringContaining("test.jpg"),
        filename: expect.stringContaining("test.jpg"),
        path: expect.stringContaining("test.jpg"),
      });
    });
  });
});
