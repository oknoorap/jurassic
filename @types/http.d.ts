type HttpRequest = {
  params?: any;
} & Request;

type HttpResponse = {
  headers: Headers;
  body: string | Uint8Array | Deno.Reader | undefined;
  status: number;
  setStatus: (code: number) => void;
};

type HttpMethod = "GET" | "POST" | "OPTIONS" | "DELETE";
