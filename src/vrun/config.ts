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
  valueDesc?: {
    type: string;
    [prop: string]: any;
  };
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
  {
    name: "color.background1",
    value: "#FFFFFF",
    description: "the background color of main cell",
  },
  {
    name: "color.background2",
    value: "#EEEEEE",
    description: "the background color of item cell",
  },
  {
    name: "color.background3",
    value: "#DDDDDD",
    description: "the background color of selected item cell",
  },
  {
    name: "color.foreground1",
    value: "#000000",
    description:
      "the foreground color of font, include input of main cell and name of item cell",
  },
  {
    name: "color.foreground2",
    value: "#333333",
    description: "the foreground color of item cell's description",
  },
  {
    name: "color.foreground3",
    value: "#409eff",
    description: "the theme color of app, example red, green...",
  },
  {
    name: "keymap.typeInterval",
    value: 500,
    description: "the time interval to wait special key when type",
  },
  {
    name: "keymap.type2select",
    value: "j",
    description: "the keymap to focus select mode when type",
  },
  {
    name: "keymap.typeClear",
    value: "d",
    description: "the keymap to clear type input when type",
  },
  {
    name: "keymap.select2type",
    value: "a",
  },
  {
    name: "keymap.selectUp",
    value: "k",
  },
  {
    name: "keymap.selectDown",
    value: "j",
  },
  {
    name: "keymap.selectPageUp",
    value: "K",
  },
  {
    name: "keymap.selectPageDown",
    value: "J",
  },
  {
    name: "keymap.selectFirst",
    value: "g",
  },
  {
    name: "keymap.selectLast",
    value: "G",
  },
  {
    name: "keymap.selectEnter",
    value: "l",
  },
  {
    name: "keymap.selectExit",
    value: "h",
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
