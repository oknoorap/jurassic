import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/http.d.ts";

export default (req: HttpRequest, res: HttpResponse) => {
  return `slug: ${req.params.slug}, id: ${req.params.id}`;
};
