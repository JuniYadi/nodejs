import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayEventRequestContextV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import pino from "pino";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const p = pino();
const date = () => dayjs().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ssZ");

export interface ILogger {
  event?: Partial<APIGatewayProxyEvent>;
  response?: Partial<APIGatewayProxyResult>;
  context?: Partial<Context>;
}

export interface ILoggerMiddleware extends ILogger {
  coldStart?: boolean;
}

export const logger = (config?: ILogger) => {
  // set logger child
  let child = p.child({
    date: date(),
  });

  // cleanup context
  if (config?.context) {
    const ctx = Object.assign({}, config?.context);
    // clean unused data context
    delete ctx?.invokedFunctionArn;
    delete ctx?.callbackWaitsForEmptyEventLoop;
    delete ctx?.logGroupName;
    delete ctx?.logStreamName;
    delete ctx?.functionName;

    child = child.child(ctx);
  }

  return child;
};

export const logMiddleware = ({
  event,
  response,
  context,
  coldStart,
}: ILoggerMiddleware) => {
  const child = logger({ context }).child({ coldStart });
  const ev: any = Object.assign({}, event ?? response);

  delete ev?.headers;
  delete ev?.rawQueryString;
  delete ev?.multiValueHeaders;
  delete ev?.requestContext;
  delete ev?.multiValueQueryStringParameters;
  delete ev?.callbackWaitsForEmptyEv;
  delete ev?.logGroupName;
  delete ev?.logStreamName;
  delete ev?.functionName;

  if (ev?.body && typeof ev.body === "string") {
    try {
      ev.body = JSON.parse(ev.body);
    } catch (e) {
      // do nothing
    }
  }

  return child.info(ev);
};
