import * as path from "https://deno.land/std/path/mod.ts";

import { Router, RouterGroups, RouterMeta } from "../@types/router.d.ts";
import { HttpRequest, HttpResponse } from "../@types/http.d.ts";
import * as log from "./logger.ts";

const routerExt = ["ts"];
const inBracketExpr = /\[([^\[\]]*)\]/g;
const globExpr = /\*/g;
const routesRootDir = "routes";

/**
 * Walk directory, valid file if extension is on the list
 * @param root root path.
 */
const walkDir = (root: string): string[] => {
  const list = [];

  for (const file of Deno.readDirSync(root)) {
    const cwd = path.join(root, file.name);
    const [_, extname] = path.extname(cwd).split(".");
    const isValidFile = routerExt.includes(extname);

    if (file.isDirectory) {
      list.push(walkDir(cwd));
    }

    if (file.isFile && isValidFile) {
      list.push([cwd]);
    }
  }

  return list.flat();
};

/**
 * Get params from filename
 * @param filepath File path
 */
const getFileParams = (filepath: string) => {
  const params = [];
  const matches = filepath.matchAll(inBracketExpr);

  for (const [_, captured] of matches) {
    params.push(captured);
  }

  return params;
};

/**
 * Get params from url
 * @param url File path
 */
const getURLParams = (url: string, glob: string) => {
  const params = [];

  const paramExpr = new RegExp(
    `${glob.replace(globExpr, "([a-zA-Z0-9-_]*)")}`,
    "g"
  );
  const matches = url.matchAll(paramExpr);

  for (const [_, captured] of matches) {
    params.push(captured);
  }

  return params;
};

/**
 * Get routers in `routes` directory
 */
export const scanRouters = () => {
  const cwd = Deno.cwd();
  const routerDir = path.join(cwd, routesRootDir);

  if (!Deno.statSync(routerDir).isDirectory) {
    return [];
  }

  const routers = walkDir(routerDir).map((routePath) => {
    const params = getFileParams(routePath);
    const [, filepath] = routePath.split(routerDir);
    const [url] = filepath.split(path.parse(filepath).ext);

    return {
      path: routePath,
      url,
      params,
    };
  });

  return routers;
};

/**
 * Get routers, grouping by glob
 */
export const getRouters = (): RouterGroups => {
  const routers = scanRouters();
  const routerGroups: RouterGroups = {};

  for (const { url, path, params } of routers) {
    const glob = url.replace(inBracketExpr, "*");
    if (!routerGroups[glob]) {
      routerGroups[glob] = [];
    }

    routerGroups[glob].push({
      url,
      path,
      params,
    });
  }

  return routerGroups;
};

/**
 * Get dynamic router patterns from URL
 * @param routerGroups Router groups
 * @param url
 */
export const getRouterPatterns = (routerGroups: RouterGroups, url: string) => {
  let currentRouter: RouterMeta | undefined;
  let currentGlob: string = "";
  let routerParams: any = {};

  if (routerGroups[url]) {
    [currentRouter] = routerGroups[url];
    return [currentRouter, routerParams];
  }

  // TODO: Find best practice to find pattern efficiently
  for (const routerList in routerGroups) {
    const expr = new RegExp(routerList, "g");

    if (!expr.test(url)) {
      break;
    }

    const matchGlob = routerList.match(globExpr);
    const paramsCount = matchGlob?.length ?? 0;
    const routers = routerGroups[routerList].filter(
      ({ params }: RouterMeta) => params.length === paramsCount
    );

    // Always set active router with latest mathed router
    currentGlob = routerList;
    for (const router of routers) {
      currentRouter = router;
    }
  }

  // Set params
  if (currentRouter) {
    const params = getURLParams(url, currentGlob);
    routerParams = Object.fromEntries(
      currentRouter.params.map((item: RouterMeta, index: number) => [
        item,
        params[index],
      ])
    );
  }

  return [currentRouter, routerParams];
};

/**
 * Import router file for handler
 * @param router
 */
enum CommonContentType {
  HTML = "html",
  Text = "text",
  JSON = "json",
}

export const getRouterHandler = async (
  router: RouterMeta,
  request: HttpRequest,
  params: any
): Promise<HttpResponse> => {
  let body;
  const headers = new Headers();
  const status = 503;
  const response: HttpResponse = {
    body,
    headers,
    status,
    setStatus(code: number) {
      response.status = code;
    },
  };

  if (!router) {
    return response;
  }

  const defaultRouter: Router = {
    headers: {},
    method: ["GET", "POST", "OPTIONS", "DELETE"],
    onError: () => null,
  };

  const {
    default: handler,
    headers: routeHeaders,
    onError,
    contentType,
    method,
  }: Router = {
    ...defaultRouter,
    ...(await import(router.path)),
  };

  let headerContentType = contentType;
  const isCommonContentType =
    CommonContentType.HTML || CommonContentType.JSON || CommonContentType.Text;

  if (isCommonContentType) {
    switch (contentType) {
      case CommonContentType.HTML:
        headerContentType = "text/html";
        break;

      case CommonContentType.JSON:
        headerContentType = "application/json";
        break;

      case CommonContentType.Text:
        headerContentType = "text/plain";
        break;
    }
  }

  if (headerContentType) {
    routeHeaders["Content-Type"] = headerContentType;
  }

  // Parsing headers.
  for (const headerKey of Object.keys(routeHeaders)) {
    response.headers.set(headerKey, routeHeaders[headerKey]);
  }

  // Parsing body.
  try {
    const isValidMethod = request.method == method;
    const isValidMethods =
      Array.isArray(method) && method.includes(request.method);

    if (!(isValidMethod || isValidMethods)) {
      response.status = 503;
      throw new Error("Invalid http method");
    }

    request.params = params;
    response.status = 200;
    response.body = await handler(request, response);
  } catch (err) {
    log.error(request.url, err?.message);
    response.body = onError(err, request);
  }

  if (
    contentType === CommonContentType.JSON &&
    response.body instanceof Object
  ) {
    response.body = JSON.stringify(response.body);
  }

  return response;
};
