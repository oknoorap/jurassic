![Jurassic Logo](https://raw.githubusercontent.com/oknoorap/jurassic/master/docs/logo.png)

# 🦖 Jurassic

A Straightforward REST API Framework for Deno. Zero-config server with path-based router.

## Features

✅ Zero-Config framework  
✅ Instant path-based routing  
✅ Dynamic route params with filename  
✅ Suport Hooks

## Table of Contents

<details open>
<summary>Table of Contents</summary>

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Basic Usage](#basic-usage)
  - [Routers](#routers)
  - [Run Server](#run-server)
  - [Dynamic Route Params](#dynamic-route-params)
  - [Router Methods](#router-methods)
  - [Multiple Handler](#multiple-handler)
  - [Overrides Header](#overrides-header)
  - [Set Content Type](#set-content-type)
  - [Router Best Pratice](#router-best-practice)
  - [Custom Config](#custom-config)
- [Examples](#examples)

</details>

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

<details open>
<summary>Example Code</summary>

```typescript
// <your_current_directory>/routes/hello.ts
import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/routes.d.ts";

// Route Handler
export default (req: HttpRequest, res: HttpResponse) => {
  return "Hello world";
};
```

</details>

### Run Server

Type this command in your current directory, from your favourite terminal.

`deno --allow-read --allow-net --allow-env https://deno.land/x/jurassic/server.ts`

If you see log below, then your server is running successfuly.

<details open>
<summary>Console Log</summary>

```bash
🦖 Start jurassic server
-------------------
[server info]
PORT: 8888

[routes]
- /hello
-------------------
```

</details>

Now access test in your browser `http://localhost/hello`.

### Dynamic Route Params

I believe building REST API router should be easy. As NextJS developer, I'm inspired by NextJS API directory, using bracket filename as dynamic routes params.

To create a dynamic route with params, just use bracket as directory or file name e.g `[type]/[slug].ts`. You can use it as nested directory too.

You can accessing param within route handler with `req.params`, e.g `req.params.myParams`.

<details open>
<summary>Example Code</summary>

```typescript
// <your_current_directory>/routes/post/[id].ts
import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/routes.d.ts";

export default (req: HttpRequest, res: HttpResponse) => {
  return `Post ID: ${req.params.id}`;
};
```

</details>

### Router Methods

By default your router will accepts all methods (`GET`, `POST`, `PUT`, `OPTIONS`, `DELETE`), but you can define or restrict it, to do that just export `method` variable. It support array or string.

<details open>
<summary>Example Code</summary>

```typescript
// <your_current_directory>/routes/v1/your-router.ts
import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/routes.d.ts";

export const method = ["GET", "POST"];
// or
// export const method = "POST"

export default (req: HttpRequest, res: HttpResponse) => {
  return `Method ${req.method}`;
};
```

</details>

### Multiple Handler

In the previous section you can define or restrict router methods, but what if every method have different response or consume different database / service. You can use multiple handler:

<details open>
<summary>Example Code</summary>

```typescript
// <your_current_directory>/routes/v1/your-router.ts
import { HttpRequest, HttpResponse } from "https://deno.land/x/jurassic/@types/routes.d.ts";

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

</details>

### Overrides Header

<details open>
<summary>Example Code</summary>

```typescript
// <your_current_directory>/routes/v1/your-router.ts
import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/routes.d.ts";

export const headers = {
  // your http header here
};

export default (req: HttpRequest, res: HttpResponse) => {
  return `My Router`;
};
```

</details>

### Set Content Type

You can set `Content-Type` in `headers` or `contentType` variable. The difference is `contentType` use shortcut.

<details open>
<summary>Example Code</summary>

```typescript
// <your_current_directory>/routes/hello.ts

import {
  HttpRequest,
  HttpResponse,
} from "https://deno.land/x/jurassic/@types/routes.d.ts";

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

</details>

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

### Custom Config

You can change port and add environment to your project. Create a `server.ts` file in your directory. And export port / env file. We added `SERVER_ENV_` to your environment.

<details open>
<summary>Example Code</summary>

```typescript
// <your_current_directory>/server.ts
// Custom PORT
export const port = 3000;

// Environment
export const env = {
  MY_KEY: "secret-key",
};

// <your_current_directory>/routes/hello.ts
// access environment
Deno.env.get("SERVER_ENV_MY_KEY");
```

</details>

## Examples

See example codes in [Examples](/examples) directory.

## License

MIT - 2020 (c) oknoorap. More details see LICENSE file.
