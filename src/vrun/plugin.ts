import { VConfigItem, addConfigItem } from "./config";
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
  afterRegister?: () => any;
}

const plugin = new Map<string, VPlugin>();

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
