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
