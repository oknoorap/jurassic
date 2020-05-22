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
  onStart: () => Promise<void>;
};

/**
 * Bootstrap logger.
 * @param logs
 */
export const logger = (logs: BootstrapLog[]) => {
  log.empty();
  console.log("🦖 Start jurassic server");
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
    async onStart() {},
  };

  const customServerFile = path.join(Deno.cwd(), "server.ts");
  if (!(await isExists(customServerFile))) {
    return defaultServerConfig;
  }

  const { port, env, middleware, onBeforeStart, onStart }: Server = {
    ...defaultServerConfig,
    ...(await import(customServerFile)),
  };

  const serverEnv: [string, any][] = [];
  if (env instanceof Object && env.constructor === Object) {
    for (const key in env) {
      const value = env[key];
      const envName = `SERVER_ENV_${key.toUpperCase()}`;
      serverEnv.push([envName, value]);
      Deno.env.set(envName, value);
    }
  }

  return {
    port,
    env: Object.fromEntries(serverEnv),
    middleware,
    onBeforeStart,
    onStart,
  };
};

/**
 * Start server.
 */
export const serve = async () => {
  const { port, env, onBeforeStart, onStart } = await initServer();
  const routers = await getRouters();

  await onBeforeStart();
  const server = httpServer({ port });

  const logs = [
    {
      label: "server info",
      info: `PORT: ${port}`,
      options: { padding: false },
    },
    {
      label: "routes",
      info: Object.keys(routers)
        .map((item) => `- ${item}`)
        .join("\n"),
    },
  ];

  if (Object.keys(env).length > 0) {
    logs.push({
      label: "environment",
      info: Object.keys(env)
        .map((item) => `- ${item}: ${env[item]}`)
        .join("\n"),
    });
  }

  logger(logs);

  await onStart();
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
