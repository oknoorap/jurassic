import { serve } from "https://deno.land/std/http/server.ts";

import {
  getRouters,
  getRouterPatterns,
  getRouterHandler,
} from "./utils/router.ts";
import * as log from "./utils/logger.ts";

const port = 8000;
const server = serve({ port });
const routers = getRouters();

// Start server
log.empty();
console.log("🦖 Start jurrasic server");
console.log("---");
log.log([`Port: ${port}`], {
  type: "info",
  label: "server info",
  padding: false,
});
log.log(
  [
    Object.keys(routers)
      .map((item) => `- ${item}`)
      .join("\n"),
  ],
  {
    label: "routes",
    type: "info",
  }
);
console.log("---");

for await (const req of server) {
  const [router, params] = getRouterPatterns(routers, req.url);
  const { headers, body, status } = await getRouterHandler(router, req, params);
  await req.respond({
    headers,
    body,
    status,
  });
}
