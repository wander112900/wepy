import wepy from "wepy";
import interfaces from "../api/login";
import util from "./util";
import md5 from "./md5";
import tip from "./tip";

const API_SECRET_KEY = "wander";

async function request(options) {
  tip.loading();
  let timestamp = util.getCurrentTime();
  let sign = md5.hex_md5((timestamp + API_SECRET_KEY).toLowerCase());
  if (options.header) {
    options.header["X-WECHAT-SESSION"] = wepy.getStorageSync("_session");
  } else {
    options.header = {
      "X-WECHAT-SESSION": wepy.getStorageSync("_session")
    };
  }
  options.header["X-TIMESTAMP"] = timestamp;
  options.header["X-SIGN"] = sign;

  let response = await wepy.request(options);

  if (response.statusCode === 401) {
    await interfaces.login();
    return await request(options);
  } else if (response.statusCode === 500) {
    wepy.showModal({
      title: "提示",
      content: "服务器错误，请与管理员联系。"
    });
  } else {
    tip.loaded();
    return response;
  }
}

export async function post(url, params = {}) {
  let options = {
    method: "POST",
    url: url,
    data: params,
    header: { "Content-Type": "application/json" },
    dataType: "json"
  };
  return await request(options);
}

export async function get(url, params = {}) {
  let options = {
    method: "GET",
    url: url,
    data: params,
    header: { "Content-Type": "application/json" }
  };
  return await request(options);
}
