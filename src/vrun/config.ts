import path from "path";
import { reactive, watch } from "vue";
import { ipcRenderer } from "electron";
import _ from "lodash";
import { VHOME, screenWidth, screenHeight } from "./const";
import { loadDB, Log } from "./util";

const logger = Log.getLogger("config");

export interface VConfigItem {
  name: string;
  value: any;
  description?: string;
  validator?: (value: any) => boolean;
  next?: (value: any) => any;
  prev?: (value: any) => any;
  watcher?: (newValue: any, oldValue: any) => any;
  watchImmediate?: boolean;
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
  if (item.watcher) {
    watch(() => _.cloneDeep(get(item.name)), item.watcher, {
      immediate: item.watchImmediate === undefined ? true : item.watchImmediate,
    });
  }
  logger.trace("add config item:", item);
}

export function addConfigItems(items: VConfigItem[]): void {
  for (const item of items) {
    addConfigItem(item);
  }
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

const buildinConfigItems: VConfigItem[] = [
  {
    name: "app.font",
    value:
      "system-ui,-apple-system,BlinkMacSystemFont,Microsoft YaHei,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
    description: "UI font",
  },
  {
    name: "app.hotkey",
    value: "alt+a",
    description: "the keymap of hide or show the window",
    watcher: (newValue: string) => {
      logger.debug(newValue);
      ipcRenderer.send("setHotkey", newValue);
    },
  },
  {
    name: "cell.width",
    value: 700,
    description: "the width of a single cell",
    watcher: setPosition,
    watchImmediate: false,
  },
  {
    name: "cell.height",
    value: 50,
    description: "the height of a single cell",
    watcher: setPosition,
    watchImmediate: false,
  },
  {
    name: "item.max",
    value: 10,
    description: "the max number of visible item",
    watcher: setPosition,
    watchImmediate: false,
  },
];

addConfigItems(buildinConfigItems);

function setPosition() {
  const screenx = (screenWidth - get("cell.width")) / 2;
  const screeny =
    (screenHeight - get("cell.height") * (1 + get("item.max"))) / 2;
  ipcRenderer.send("setPosition", screenx, screeny);
  logger.trace("window rePosition to:", screenx, screeny);
}

setPosition();
