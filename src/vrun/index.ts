import * as vconst from "./const";
import * as vconfig from "./config";
import * as vutil from "./util";

const vrun = {
  ...vconst,
  ...vconfig,
  ...vutil,
};

export default vrun;

export type VType = typeof vrun;
