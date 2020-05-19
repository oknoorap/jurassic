import {
  HttpRequest,
  HttpResponse,
} from "/Users/oknoorap/codes/project/jurrasic/@types/http.d.ts";

export const contentType = "text";

export default (req: HttpRequest, res: HttpResponse) => {
  return `project ${req.params.projectId}`;
};
