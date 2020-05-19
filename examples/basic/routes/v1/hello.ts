import {
  HttpRequest,
  HttpResponse,
} from "/Users/oknoorap/codes/project/jurassic/@types/http.d.ts";

export const contentType = "json";

export const method = ["GET", "POST"];

export default {
  post(req: HttpRequest, res: HttpResponse) {
    return {
      hello: "from post",
    };
  },

  get(req: HttpRequest, res: HttpResponse) {
    return {
      hello: "from get",
    };
  },
};
