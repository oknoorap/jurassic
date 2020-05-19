import {
  HttpRequest,
  HttpResponse,
} from "/Users/oknoorap/codes/project/jurrasic/@types/http.d.ts";

import * as log from "/Users/oknoorap/codes/project/jurrasic/utils/logger.ts";

export const contentType = "text";

export default (req: HttpRequest, res: HttpResponse) => {
  log.info(Date.now(), "itemId", req.params);
  log.success("itemId", req.params.itemId);
  log.warn("itemId", req.params.itemId);
  log.error("itemId", req.params.itemId);
  return `item ${JSON.stringify(req.params)}`;
};
