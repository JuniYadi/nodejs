import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

const TIMEZONE = process.env.TIMEZONE || "Asia/Jakarta";

interface IDayjs {
  timezone?: string;

  /**
   * Default format is "YYYY-MM-DDTHH:mm:ssZ"
   */
  format?: string;
}

export const date = dayjs;

export const now = (config?: IDayjs) =>
  dayjs()
    .tz(config?.timezone)
    .format(config?.format || "YYYY-MM-DDTHH:mm:ssZ");

export const fromNow = (date: string) => dayjs(date).fromNow();

export const fromDate = (date: string | Date, config?: IDayjs) =>
  dayjs(date)
    .tz(config?.timezone)
    .format(config?.format || "dddd, DD MMM YYYY HH:mm:ss Z");

export const fromDateHuman = (date: string | Date, config?: IDayjs) =>
  dayjs()
    .tz(config?.timezone)
    .to(dayjs(date));

export const timestampToDate = (timestamp: number, config?: IDayjs) =>
  dayjs.unix(timestamp).tz(config?.timezone).toISOString();
