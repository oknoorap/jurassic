import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/http.d.ts";

export const headers = {
  ["Content-Type"]: "text/plain",
};

export default {
  get(req: HttpRequest, res: HttpResponse) {
    return "GET method";
  },

  post(req: HttpRequest, res: HttpResponse) {
    return "POST method";
  },
};
