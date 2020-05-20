import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/http.d.ts";

import * as log from "https://deno.land/x/jurassic/lib/logger.ts";

export const onError = async (err: Error, req: HttpRequest) => {
  log.info("error", err);

  return {
    error: true,
    message: err.message,
  };
};

export default (req: HttpRequest, res: HttpResponse) => {
  throw new Error("This page crashed!");
};
