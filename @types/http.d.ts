type HttpRequest = Request & {
  params?: Record<string, unknown>;
};

type HttpResponse = {
  headers: Headers;
  body: string | Uint8Array | Deno.Reader | undefined;
  status: number;
  setStatus: (code: number) => void;
};

type HttpMethod = "GET" | "POST" | "OPTIONS" | "DELETE";
