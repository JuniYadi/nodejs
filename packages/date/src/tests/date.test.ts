import { date, now, fromNow } from "../index";

describe("date", () => {
  describe("now", () => {
    it("should return the current date and time in the specified timezone", () => {
      const result = now("America/New_York");
      const expected = date()
        .tz("America/New_York")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      expect(result).toBe(expected);
    });

    it("should return the current date and time in the default timezone if no timezone is specified", () => {
      const result = now();
      const expected = date().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ssZ");
      expect(result).toBe(expected);
    });
  });

  describe("fromNow", () => {
    it("should return the relative time from the given date to the current date", () => {
      const currentDate = date();
      const pastDate = date().subtract(2, "hour");
      const result = fromNow(pastDate.toISOString());
      const expected = currentDate.diff(pastDate, "hour") + " hours ago";
      expect(result).toBe(expected);
    });
  });
});
