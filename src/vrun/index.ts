import * as vconst from "./const";
import * as vconfig from "./config";
import * as vplugin from "./plugin";
import * as vquery from "./query";
import * as vitem from "./item";
import * as vinput from "./input";
import * as vmatch from "./match";
import * as vwindow from "./window";
import * as vutil from "./util";

const vrun = {
  ...vconst,
  ...vconfig,
  ...vplugin,
  ...vquery,
  ...vitem,
  ...vinput,
  ...vmatch,
  ...vwindow,
  ...vutil,
};

export default vrun;

export type VType = typeof vrun;
