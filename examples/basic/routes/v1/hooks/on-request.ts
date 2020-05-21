import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/http.d.ts";

import * as log from "https://deno.land/x/jurassic/lib/logger.ts";

export const onRequest = async (req: HttpRequest, res: HttpResponse) => {
  log.info("test from", req.url);
};

export default (req: HttpRequest, res: HttpResponse) => {
  return "On request test";
};
