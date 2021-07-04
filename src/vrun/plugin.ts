import { VConfigItem, addConfigItem } from "./config";
import { VItem } from "./item";
import logo from "@/assets/vrun.png";
import vrun from ".";
import { Log } from "./util";

const logger = Log.getLogger("plugin");

interface VPlugin {
  uuid: string;
  name: string;
  icon: string;
  keyword: string;
  keywordConfigurable?: boolean;
  configItems?: VConfigItem[];
  description?: string;
  useHot?: boolean;
  afterRegister?: () => any;
  afterEnter?: () => void;
  beforeLeave?: () => void;
  search?: (searchword: string) => any;
  enter?: (item: VItem) => any;
  exit?: (item: VItem) => any;
  handle?: (item: VItem, msg: string) => any;
}

export const plugin = new Map<string, VPlugin>();

export function registerPlugin(newPlugin: VPlugin): void {
  if (
    newPlugin.keywordConfigurable === undefined ||
    newPlugin.keywordConfigurable
  ) {
    if (newPlugin.configItems === undefined) newPlugin.configItems = [];
    newPlugin.configItems.push({
      name: "keyword",
      value: newPlugin.keyword,
      validator: (value) => {
        if (typeof value === "string" && value.indexOf(" ") === -1) {
          return true;
        } else {
          return false;
        }
      },
      watcher: (newValue, oldValue) => {
        plugin.delete(oldValue);
        newPlugin.keyword = newValue;
        setPlugin(newPlugin);
      },
    });
  } else {
    setPlugin(newPlugin);
  }
  for (const item of newPlugin.configItems || []) {
    // add config item name prefix
    item.name = `plugin.${newPlugin.uuid}.${item.name}`;
    addConfigItem(item);
  }
}

function setPlugin(newPlugin: VPlugin): void {
  plugin.set(newPlugin.keyword, newPlugin);
  newPlugin.afterRegister?.();
  logger.trace("new plugin:", newPlugin);
}

registerPlugin({
  uuid: "c97d6164-d0f2-43cb-bbe5-56385ed1e329",
  name: "core",
  icon: logo,
  keyword: "",
  keywordConfigurable: false,
  description: "core plugin for vrun app",
  useHot: true,
  search: (searchword) => {
    const ret: VItem[] = [];
    if (searchword !== "") {
      const count = Math.floor(Math.random() * 51);
      for (let i = 1; i <= count; i++) {
        ret.push({
          name: "name " + i,
          description: "description " + i,
          value: "value " + i,
        });
      }
    }
    vrun.setItems(ret);
  },
});
