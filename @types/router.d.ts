type RouterMeta = {
  url: string;
  path: string;
  params: string[];
};

type RouterGroups = {
  [key: string]: RouterMeta[];
};

type Router = {
  default: () => void | Promise<void>;
  headers: any;
  method: HttpMethod | HttpMethod[];
};
