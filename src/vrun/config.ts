import path from "path";
import { reactive } from "vue";
import _ from "lodash";
import { VHOME } from "./const";
import { loadDB, Log } from "./util";

const logger = Log.getLogger("config");

export interface VConfigItem {
  name: string;
  value: any;
  description?: string;
  validator?: (value: any) => boolean;
  next?: (value: any) => any;
  prev?: (value: any) => any;
}

const config = reactive(new Map<string, VConfigItem>());

const customConfigPath = path.join(VHOME, "config.json");
const customConfigDB = loadDB(customConfigPath, {} as any);
const customConfig = customConfigDB.data!;
logger.trace("custom config:", customConfig);

export function addConfigItem(item: VConfigItem): void {
  if (!validate(item, item.value)) return;
  config.set(item.name, item);
  const customValue = _.get(customConfig, item.name, undefined);
  if (customValue !== undefined && validate(item, customValue)) {
    const value = item.value;
    item.value = customValue;
    logger.trace("apply %s from %o to %o", item.name, value, customValue);
  }
  logger.trace("add config item:", item);
}

export function get(name: string): any {
  return config.get(name)?.value;
}

export function set(name: string, value: any): void {
  const configItem = config.get(name);
  if (configItem && validate(configItem, value)) {
    const oldValue = configItem.value;
    configItem.value = value;
    _.set(customConfig, name, value);
    customConfigDB.write();
    logger.trace("update %s from %o to %o", name, oldValue, value);
  }
}

function validate(item: VConfigItem, value: any): boolean {
  if (item.validator && item.validator(value) === false) {
    return false;
  } else {
    return true;
  }
}
