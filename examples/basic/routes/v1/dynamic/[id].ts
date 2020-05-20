import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/http.d.ts";

export default (req: HttpRequest, res: HttpResponse) => {
  return `id: ${req.params.id}`;
};
