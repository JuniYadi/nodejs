import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpSecurityHeaders from "@middy/http-security-headers";
import inputOutputLogger from "@middy/input-output-logger";
import { logMiddleware } from "./logger";

let coldStart = true;

const coldStartMiddleware = () => {
  const after = () => {
    coldStart = false;
  };

  return { after };
};

export const customMiddy = (middleware?: any[]) => {
  const allMiddleware = [coldStartMiddleware(), httpSecurityHeaders(), cors()];

  // inject middleware to allMiddleware
  if (middleware) {
    allMiddleware.push(...middleware);
  }

  // push logMiddleware to the end
  // Add more middleware here
  allMiddleware.push(
    inputOutputLogger({
      logger: (request) =>
        logMiddleware({
          event: request?.event,
          context: request?.context,
          coldStart,
        }),
      awsContext: true,
    })
  );

  return middy().use(allMiddleware);
};
