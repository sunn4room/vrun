import * as vconst from "./const";
import * as vconfig from "./config";
import * as vplugin from "./plugin";
import * as vitem from "./item";
import * as vutil from "./util";

const vrun = {
  ...vconst,
  ...vconfig,
  ...vplugin,
  ...vitem,
  ...vutil,
};

export default vrun;

export type VType = typeof vrun;
