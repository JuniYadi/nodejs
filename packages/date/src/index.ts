import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

const TIMEZONE = process.env.TIMEZONE;

interface IDayjs {
  timezone?: string;

  /**
   * Default format is "YYYY-MM-DDTHH:mm:ssZ"
   */
  format?: string;
}

/**
 * Extend dayjs instance
 */
export const date = dayjs;

/**
 * Get current date with timezone and format
 *
 * @param config
 * @returns string
 */
export const now = (config?: IDayjs) =>
  dayjs()
    .tz(TIMEZONE || config?.timezone)
    .format(config?.format || "YYYY-MM-DDTHH:mm:ssZ");

/**
 * Display date difference from now
 *
 * @param date string
 * @returns string
 */
export const fromNow = (date: string) => dayjs(date).fromNow();

/**
 * Display date difference from now with specific timezone and format
 *
 * @param date string
 * @param config IDayjs
 * @returns string => "Sunday, 01 Jan 2021 00:00:00 +0700"
 */
export const fromDate = (date: string | Date, config?: IDayjs) =>
  dayjs(date)
    .tz(config?.timezone)
    .format(config?.format || "dddd, DD MMM YYYY HH:mm:ss Z");

/**
 * Display date difference from now with specific for human
 *
 * @param date string
 * @param config IDayjs
 * @returns string => "1 year ago"
 */
export const fromDateHuman = (date: string | Date, config?: IDayjs) =>
  dayjs().tz(config?.timezone).to(dayjs(date));

/**
 * Convert Timestamp to Date ISO String
 *
 * @param timestamp number
 * @param config IDayjs
 * @returns string => "2021-01-01T00:00:00Z"
 */
export const timestampToDate = (timestamp: number, config?: IDayjs) =>
  dayjs.unix(timestamp).tz(config?.timezone).toISOString();
