import {
  HttpRequest,
  HttpResponse,
} from "/Users/oknoorap/codes/project/jurrasic/@types/http.d.ts";

export const headers = {
  ["Content-Type"]: "text/plain",
};

export default (req: HttpRequest, res: HttpResponse) => {
  return "testing";
};
