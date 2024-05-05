import pino from "pino";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const p = pino();
export const now = () => dayjs().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ssZ");