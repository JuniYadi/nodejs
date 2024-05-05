import { Hono } from "hono";
import type {
  LambdaEvent,
  LambdaContext,
  ApiGatewayRequestContext,
} from "hono/aws-lambda";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { compress } from "hono/compress";
import { etag } from "hono/etag";
import { p, now } from "./logger";

type Bindings = {
  event: LambdaEvent;
  lambdaContext: LambdaContext;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors());
app.use(csrf());
app.use(etag({ weak: true }));
app.use(compress());
app.use(secureHeaders());

// Custom logger
let coldStart = true;
app.use(async (c, next) => {
  // const body = await c.req.json();
  const ua = c.env.event.headers?.["User-Agent"] || "";
  const ip = c.env.event.headers?.["X-Forwarded-For"] || "";

  const body = async () => {
    try {
      const getBody = await c.req.json();
      const changeBody = { ...getBody };

      // remove sensitive data
      if (changeBody.password) {
        changeBody.password = "****";
      }

      return changeBody;
    } catch (e) {
      return {};
    }
  };

  // get query
  const url = new URL(c.req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  // delete sensitive data
  if (["refresh_token", "device_key"].some((key) => query[key])) {
    delete query["refresh_token"];
    delete query["device_key"];
  }

  p.info({
    date: now(),
    coldStart,
    method: c.req.method,
    path: c.req.path,
    request: `${c.req.method} ${c.req.path}`,
    query: query,
    lambdaRequestId: c.env.lambdaContext.awsRequestId,
    requestId: (c.env.event.requestContext as ApiGatewayRequestContext)
      .requestId,
    userAgent: ua,
    userIp: ip,
    body: await body(),
  });

  await next();

  // update coldStart
  coldStart = false;
});

// Custom Response
type IResponseCode = {
  [key: number]: string;
};

const responseCode: IResponseCode = {
  200: "success",
  400: "Invalid Request!",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

type IResponse = {
  code?: keyof typeof responseCode;
  message?: string;
  data?: any;
  errors?: any;
};

export const setResponse = (c: any, config: IResponse) => {
  const code = config.code || 200;
  const message = config.message || responseCode[code];

  // set status code
  c.status(config.code);

  return c.json({
    code: config.code,
    message: message,
    data: config.data || undefined,
    errors: config.errors || undefined,
  });
};

export default app;
