import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const TIMEZONE = process.env.TIMEZONE || "Asia/Jakarta";

export const date = dayjs;

export const now = (tz?: string) =>
  dayjs()
    .tz(tz || TIMEZONE)
    .format("YYYY-MM-DDTHH:mm:ssZ");

export const fromNow = (date: string) => dayjs(date).fromNow();
