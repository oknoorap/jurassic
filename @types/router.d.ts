type RouterMeta = {
  url: string;
  path: string;
  params: string[];
};

type RouterGroups = {
  [key: string]: RouterMeta[];
};

type HttpMethod = "GET" | "POST" | "OPTIONS" | "DELETE";

type Router = {
  default: () => void | Promise<void>;
  headers: any;
  method: HttpMethod | HttpMethod[];
  CORS: string;
};
