import { date, now, fromNow, fromDate, fromDateHuman, timestampToDate } from "../index";

describe("date", () => {
  describe("now", () => {
    it("should return the current date and time in the specified timezone", () => {
      const result = now({ timezone: "America/New_York" });
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

  describe("fromDate", () => {
    it("should return the formatted date in the specified timezone", () => {
      const result = fromDate(date().format());
      const expected = date().format("dddd, DD MMM YYYY HH:mm:ss Z");
      expect(result).toBe(expected);
    });
  });

  describe("fromDateHuman", () => {
    it("should return the humanized date in the specified timezone", () => {
      const result = fromDateHuman(date().toISOString());
      expect(result).toBe("a few seconds ago");
    });
  });

  describe("timestampToDate", () => {
    it("should return the date and time in the specified timezone from the given timestamp", () => {
      const result = timestampToDate(date().unix())
      const expected = date().toISOString();
      
      // expect result to be equest without milliseconds
      expect(result.slice(0, -5)).toBe(expected.slice(0, -5));
    });
  });
});
