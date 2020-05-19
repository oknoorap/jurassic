import * as path from "https://deno.land/std/path/mod.ts";
import { serve as httpServer } from "https://deno.land/std/http/server.ts";

import { LoggerOptions } from "../@types/common.d.ts";
import { getRouters, getRouterPatterns, getRouterHandler } from "./router.ts";
import * as log from "./logger.ts";
import { isExists } from "./files.ts";

type BootstrapLog = {
  label: string;
  info: string;
  options?: LoggerOptions;
};

type Server = {
  port: number;
  middleware: Promise<void>[];
  env?: any;

  // Hooks.
  onBeforeStart: () => Promise<void>;
  onAfterStart: () => Promise<void>;
};

/**
 * Bootstrap logger.
 * @param logs
 */
export const logger = (logs: BootstrapLog[]) => {
  log.empty();
  console.log("🦖 Start jurrasic server");
  log.line();

  for (const { info, label, options } of logs.filter((item) => item)) {
    log.log([info], {
      label,
      type: "info",
      ...options,
    });
  }

  log.line();
  log.empty();
};

const initServer = async () => {
  const defaultServerConfig: Server = {
    port: 8888,
    env: {},
    middleware: [],

    // Hooks.
    async onBeforeStart() {},
    async onAfterStart() {},
  };

  const customServerFile = path.join(Deno.cwd(), "server.ts");
  if (!(await isExists(customServerFile))) {
    return defaultServerConfig;
  }

  const { port, middleware, env, onBeforeStart, onAfterStart }: Server = {
    ...defaultServerConfig,
    ...(await import(customServerFile)),
  };

  if (env instanceof Object) {
    defaultServerConfig.env = env;
    for (const e in env) {
      Deno.env.set(`SERVER_ENV_${e.toUpperCase}`, e);
    }
  }

  return {
    port,
    env,
    middleware,
    onBeforeStart,
    onAfterStart,
  };
};

/**
 * Start server.
 */
export const serve = async () => {
  const { port, env, onBeforeStart, onAfterStart } = await initServer();
  const routers = await getRouters();

  await onBeforeStart();
  const server = httpServer({ port });

  logger([
    {
      label: "server info",
      info: `PORT: ${port}`,
      options: { padding: false },
    },

    env && {
      label: "environment",
      info: Object.keys(env)
        .map((item) => `- SERVER_ENV_${item.toUpperCase()}: ${env[item]}`)
        .join("\n"),
    },
    {
      label: "routes",
      info: Object.keys(routers)
        .map((item) => `- ${item}`)
        .join("\n"),
    },
  ]);

  await onAfterStart();
  for await (const req of server) {
    const [router, params] = getRouterPatterns(routers, req.url);
    const { headers, body, status } = await getRouterHandler(
      router,
      req,
      params
    );
    await req.respond({
      headers,
      body,
      status,
    });
  }
};
