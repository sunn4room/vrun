import { reactive, computed, watch, ref, Ref } from "vue";
import { ipcRenderer } from "electron";
import { get } from "./config";
import { curPlugin } from "./query";
import { Log } from "./util";
import vrun from ".";

const logger = Log.getLogger("item");

export interface VItem {
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

export function setItems(itemsArray: VItem[]) {
  items.splice(0, items.length);
  items.push(...itemsArray);
  selectIdx.value = 0;
  visibleStartIdx.value = 0;
  logger.debug("items:", itemsArray);
}

export const maxVisibleItemsNum = computed(() => get("item.max"));

export const visibleItemsNum = computed(() =>
  Math.min(maxVisibleItemsNum.value, items.length)
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

export const selectIdx = ref(0);

export const visibleStartIdx = ref(0);

export function setPosition(selectIndex: number, startIndex: number): void {
  selectIdx.value = selectIndex;
  visibleStartIdx.value = startIndex;
}

export const visibleEndIdx = computed(
  () => visibleStartIdx.value + visibleItemsNum.value
);

export const selectUp = (): void => {
  if (selectIdx.value > 0) selectIdx.value--;
};
export const selectDown = (): void => {
  if (selectIdx.value + 1 < items.length) selectIdx.value++;
};
export const selectPageUp = (): void => {
  selectIdx.value = Math.max(0, visibleStartIdx.value - visibleItemsNum.value);
};
export const selectPageDown = (): void => {
  selectIdx.value = Math.min(
    items.length - 1,
    visibleEndIdx.value - 1 + visibleItemsNum.value
  );
};
export const selectFirst = (): void => {
  selectIdx.value = 0;
};
export const selectLast = (): void => {
  selectIdx.value = items.length - 1;
};

watch(selectIdx, (idx) => {
  if (idx < visibleStartIdx.value) {
    visibleStartIdx.value = idx;
  } else if (idx >= visibleEndIdx.value) {
    visibleStartIdx.value = idx + 1 - visibleItemsNum.value;
  }
});

export function onEnter(): void {
  if (items.length !== 0) {
    curPlugin.value.enter?.(items[selectIdx.value]);
  }
}

export function onExit(): void {
  if (items.length !== 0) {
    curPlugin.value.exit?.(items[selectIdx.value]);
  }
}

export const messageInputs: Ref<HTMLInputElement | undefined>[] = [];
export const messageInputStrs: Ref<string>[] = [];

export function getUserInput(defaultStr = ""): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (items.length === 0) {
      reject("NoneItems");
    } else {
      messageInputStrs[selectIdx.value - visibleStartIdx.value].value =
        defaultStr;
      const input =
        messageInputs[selectIdx.value - visibleStartIdx.value].value!;
      input.onkeyup = (e) => {
        if (e.key === "Escape") {
          reject("Escape");
          vrun.focusSelectInput();
        } else if (e.key === "Enter") {
          resolve(
            messageInputStrs[selectIdx.value - visibleStartIdx.value].value
          );
          vrun.focusSelectInput();
        }
      };
      input.onblur = () => {
        reject("Blur");
      };
      input.focus();
    }
  });
}
