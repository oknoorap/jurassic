# 🦖 Jurassic

A Straightforward REST API Framework for Deno. Zero-config server with path-based router.

## Getting Started

Build an API server should be easy not a complex things. As developer, often we are struggle to build an API server, most of our time was used to restructure file and and refactor codes.

As business process evolve, more weird and complex things appears, and it's not a pokemon, but problem that we always hate.

And we don't remember where is the code and what the file for.

We're having a bad time, and after somewhile, you open old legacy codes, you feels like "who wrote this ugly codes?," it's cliché, doesn't it?

Today, developer forgot to write simple codes and file structure that every developers can read and mantain.

We're all love simplicity. And this framework exists.

---

### Basic Usage

As long as you have deno installed, and favourite code editor, you can start right away. How to start the server? let's don't skip reading this documentation.

### Routers

You don't need to create bootstrap file like any other frameworks.

Just add `routes` folder in your current working directory.

After that, add a `hello.ts` file as your first router, and you're done.

```typescript
// path: <your_current_directory>/routes/hello.ts
import { HttpRequest, HttpResponse } from "https://xxx/@types/routes.d.ts";

// Route Handler
export default (req: HttpRequest, res: HttpResponse) => {
  return "Hello world";
};
```

### Run Server

Type this command in your current directory, with your favourite terminal.

`deno --allow-read --allow-net --allow-env https://xxx` (WIP will updated URL later) .

If you see log below, then your server is running successfuly.

```bash
🦖 Start jurassic server
-------------------
[server info]
PORT: 8888

[routes]
- /hello
-------------------
```

Now access test in your browser `http://localhost/hello`.

### Dynamic Routes Params

I believe building REST API router should be easy. As NextJS developer, I'm inspired by NextJS API directory, using bracket filename as dynamic routes params.

To create a dynamic route with params, just use bracket as directory or file name e.g `[type]/[slug].ts`. You can use it as nested directory too.

You can accessing param within route handler with `req.params`, e.g `req.params.myParams`.

```typescript
// Example
// path: <your_current_directory>/routes/post/[id].ts

import { HttpRequest, HttpResponse } from "https://xxx/@types/routes.d.ts";

export default (req: HttpRequest, res: HttpResponse) => {
  return `Post ID: ${req.params.id}`;
};
```

### Router Methods

By default your router will accepts all methods (`GET`, `POST`, `PUT`, `OPTIONS`, `DELETE`), but you can define or restrict it, to do that just export `method` variable. It support array or string.

```typescript
// Example
// path: <your_current_directory>/v1/your-router.ts
import { HttpRequest, HttpResponse } from "https://xxx/@types/routes.d.ts";

export const method = ["GET", "POST"];
// or
// export const method = "POST"

export default (req: HttpRequest, res: HttpResponse) => {
  return `Method ${req.method}`;
};
```

### Multiple Handler

In the previous section you can define or restrict router methods, but what if every method have different response or consume different database / service. You can use multiple handler:

```typescript
// Example
// path: <your_current_directory>/v1/your-router.ts
import { HttpRequest, HttpResponse } from "https://xxx/@types/routes.d.ts";

export const method = ["GET", "POST"];

export default {
  get(req: HttpRequest, res: HttpResponse) => {
    return `GET response`;
  },

  post(req: HttpRequest, res: HttpResponse) => {
    return `POST response`;
  }
};
```

### Overrides Header

```typescript
// Example
// path: <your_current_directory>/v1/your-router.ts

import { HttpRequest, HttpResponse } from "https://xxx/@types/routes.d.ts";

export const headers = {
  // your http header here
};

export default (req: HttpRequest, res: HttpResponse) => {
  return `My Router`;
};
```

### Set Content Type

You can set `Content-Type` in `headers` or `contentType` variable. The difference is `contentType` use shortcut.

```typescript
// Example
// path: <your_current_directory>/hello.ts

import { HttpRequest, HttpResponse } from "https://xxx/@types/routes.d.ts";

// You can set content type with headers.
export const headers = {
  ["Content-Type"]: "application/json",
};

// Or you can use shortcut.
export const contentType = "json";

export default (req: HttpRequest, res: HttpResponse) => {
  return {
    hello: "world",
    universe: true,
    cluster: "lineakia",
  };
};
```

### Router Best Practice

Use versioning path in your router for best practice. When you're upgrading API version, developer or API consumer won't get confused.

But it's okay if you define static route, such as `ping` or `health` (for health check API).

```
❌ /routes/post/[id].ts
❌ /routes/cart/[id].ts

✅ /routes/ping.ts
✅ /routes/health.ts
✅ /routes/v1/post/[id].ts
✅ /routes/v2/users.ts
✅ /routes/v2/user/@[id].ts
✅ /routes/v2/user/[dynamic].ts
```

## Examples

See [Examples](/examples) directory.

## License

MIT - 2020 (c) oknoorap. More details see LICENSE file.
