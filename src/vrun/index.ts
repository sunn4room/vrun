import * as vconst from "./const";
import * as vconfig from "./config";
import * as vplugin from "./plugin";
import * as vquery from "./query";
import * as vitem from "./item";
import * as vinput from "./input";
import * as vutil from "./util";

const vrun = {
  ...vconst,
  ...vconfig,
  ...vplugin,
  ...vquery,
  ...vitem,
  ...vinput,
  ...vutil,
};

export default vrun;

export type VType = typeof vrun;
