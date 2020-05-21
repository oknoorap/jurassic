import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/http.d.ts";

export const method = "POST";

export const CORS = "*";

export default (req: HttpRequest, res: HttpResponse) => {
  return "Can be accessed via HTTP POST method";
};
