import { reactive, computed, watch } from "vue";
import { ipcRenderer } from "electron";
import { get } from "./config";
import { Log } from "./util";

const logger = Log.getLogger("item");

export interface VItem {
  parent?: VItem;
  name: string;
  description?: string;
  icon?: string;
  value?: any;
  valueDesc?: {
    type: string;
    [prop: string]: any;
  };
  [prop: string]: any;
}

export const items = reactive(new Array<VItem>());

export const visibleItemsNum = computed(() =>
  Math.min(get("item.max"), items.length)
);

watch(
  visibleItemsNum,
  (num) => {
    const width = get("cell.width") as number;
    const height = (get("cell.height") as number) * (1 + num);
    ipcRenderer.send("setSize", width, height);
    logger.trace("window resize to:", width, height);
  },
  { immediate: true }
);
