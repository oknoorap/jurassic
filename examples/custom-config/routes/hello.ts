import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/http.d.ts";

const universe = Deno.env.get("SERVER_ENV_UNIVERSE");
const customEnv = Deno.env.get("SERVER_ENV_CUSTOM_VAR_ENV");

export default (req: HttpRequest, res: HttpResponse) => {
  return `Hello Universe, universe is ${universe}, ${customEnv}`;
};
