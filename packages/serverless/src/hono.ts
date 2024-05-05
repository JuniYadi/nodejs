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

const hono = new Hono<{ Bindings: Bindings }>();

hono.use(cors());
hono.use(csrf());
hono.use(etag({ weak: true }));
hono.use(compress());
hono.use(secureHeaders());

// Custom logger
let coldStart = true;
hono.use(async (c, next) => {
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

export const app = hono;
