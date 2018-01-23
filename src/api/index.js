import { get, post } from "../utils/request";

const host = "https://api.it120.cc";

export const test = params => get(host + "/tz/shop/goods/detail", params);
