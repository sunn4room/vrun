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

export const config = reactive(new Map<string, VConfigItem>());

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

export function set(name: string, value: any): boolean {
  const configItem = config.get(name);
  if (configItem && validate(configItem, value)) {
    const oldValue = configItem.value;
    configItem.value = value;
    _.set(customConfig, name, value);
    customConfigDB.write();
    logger.trace("update %s from %o to %o", name, oldValue, value);
    return true;
  } else {
    return false;
  }
}

function validate(item: VConfigItem, value: any): boolean {
  if (item.validator && item.validator(value) === false) {
    return false;
  } else {
    return true;
  }
}

const validateString = (value: any): boolean => {
  if (typeof value === "string") {
    return true;
  } else {
    return false;
  }
};

const validateNumber = (value: any): boolean => {
  if (typeof value === "number") {
    return true;
  } else {
    return false;
  }
};

const validateBoolean = (value: any): boolean => {
  if (typeof value === "boolean") {
    return true;
  } else {
    return false;
  }
};

const buildinConfigItems: VConfigItem[] = [
  {
    name: "app.showOnStartup",
    value: false,
    valueDesc: {
      type: "switch",
    },
    description: "whether show the window on startup",
    validator: validateBoolean,
    next: (value: boolean) => !value,
    prev: (value: boolean) => !value,
  },
  {
    name: "app.clearOnHide",
    value: true,
    valueDesc: {
      type: "switch",
    },
    description: "whether clear type input when window hide",
    validator: validateBoolean,
    next: (value: boolean) => !value,
    prev: (value: boolean) => !value,
  },
  {
    name: "app.debounce",
    value: 100,
    valueDesc: {
      type: "slider",
      min: 100,
      max: 1000,
    },
    description: "the debounce time of type input, unit is ms",
    validator: (value: any) => {
      if (typeof value === "number") {
        if (value < 100 || value > 1000) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    next: (value: number) => value + 100,
    prev: (value: number) => value - 100,
  },
  {
    name: "app.font",
    value:
      "system-ui,-apple-system,BlinkMacSystemFont,Microsoft YaHei,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
    description: "UI font",
    validator: validateString,
  },
  {
    name: "app.hotkey",
    value: "alt+a",
    description: "the keymap of hide or show the window",
    watcher: (newValue: string) => {
      logger.debug(newValue);
      ipcRenderer.send("setHotkey", newValue);
    },
    validator: validateString,
  },
  {
    name: "cell.width",
    value: 700,
    valueDesc: {
      type: "slider",
      max: 1000,
      min: 500,
    },
    description: "the width of a single cell",
    watcher: setPosition,
    watchImmediate: false,
    validator: (value: any) => {
      if (typeof value === "number") {
        if (value < 500 || value > 1000) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    next: (value: number) => {
      return value + 50;
    },
    prev: (value: number) => {
      return value - 50;
    },
  },
  {
    name: "cell.height",
    value: 50,
    valueDesc: {
      type: "slider",
      max: 100,
      min: 40,
    },
    description: "the height of a single cell",
    watcher: setPosition,
    watchImmediate: false,
    validator: (value: any) => {
      if (typeof value === "number") {
        if (value < 40 || value > 100) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    next: (value: number) => {
      return value + 5;
    },
    prev: (value: number) => {
      return value - 5;
    },
  },
  {
    name: "item.max",
    value: 10,
    valueDesc: {
      type: "slider",
      max: 30,
      min: 5,
    },
    description: "the max number of visible item",
    watcher: setPosition,
    watchImmediate: false,
    validator: (value: any) => {
      if (typeof value === "number") {
        if (value < 5 || value > 30) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    next: (value: number) => {
      return value + 1;
    },
    prev: (value: number) => {
      return value - 1;
    },
  },
  {
    name: "color.background1",
    value: "#FFFFFF",
    description: "the background color of main cell",
    valueDesc: {
      type: "color",
    },
    validator: validateString,
  },
  {
    name: "color.background2",
    value: "#EEEEEE",
    description: "the background color of item cell",
    valueDesc: {
      type: "color",
    },
    validator: validateString,
  },
  {
    name: "color.background3",
    value: "#DDDDDD",
    description: "the background color of selected item cell",
    valueDesc: {
      type: "color",
    },
    validator: validateString,
  },
  {
    name: "color.foreground1",
    value: "#000000",
    description:
      "the foreground color of font, include input of main cell and name of item cell",
    valueDesc: {
      type: "color",
    },
    validator: validateString,
  },
  {
    name: "color.foreground2",
    value: "#333333",
    description: "the foreground color of item cell's description",
    valueDesc: {
      type: "color",
    },
    validator: validateString,
  },
  {
    name: "color.foreground3",
    value: "#409eff",
    description: "the theme color of app, example red, green...",
    valueDesc: {
      type: "color",
    },
    validator: validateString,
  },
  {
    name: "keymap.typeInterval",
    value: 500,
    description: "the time interval to wait special key when type",
    validator: validateNumber,
  },
  {
    name: "keymap.type2select",
    value: "j",
    description: "the keymap to focus select mode when type",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.typeClear",
    value: "d",
    description: "the keymap to clear type input when type",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.select2type",
    value: "a",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectUp",
    value: "k",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectDown",
    value: "j",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectPageUp",
    value: "K",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectPageDown",
    value: "J",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectFirst",
    value: "g",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectLast",
    value: "G",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectEnter",
    value: "l",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
  {
    name: "keymap.selectExit",
    value: "h",
    validator: (value: any) => {
      if (typeof value === "string" && value.length === 1) return true;
      else return false;
    },
  },
];

addConfigItems(buildinConfigItems);

function setPosition() {
  const screenx = (screenWidth - get("cell.width")) / 2;
  const screeny =
    (screenHeight - get("cell.height") * (1 + get("item.max"))) / 2;
  logger.trace("window rePosition to:", screenx, screeny);
  ipcRenderer.send("setPosition", screenx, screeny);
}

setPosition();
