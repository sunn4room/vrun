<template>
  <item-cell
    v-for="n in maxVisibleItemsNum"
    :key="n"
    :index="n - 1"
    :style="visibleStartIdx + n - 1 === selectIdx ? selectItemStyle : undefined"
    v-show="n <= visibleItemsNum"
    :item="n > visibleItemsNum ? nullItem : items[visibleStartIdx + n - 1]"
  />
  <input
    id="select_input"
    ref="selectInput"
    v-model="selectInputStr"
    @input="whenSelectInput"
    @keyup.enter="onEnter"
  />
  <div id="scrollbar" :style="scrollbarStyle" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import vrun from "@/vrun";
import { VItem } from "@/vrun/item";
import ItemCell from "./ItemCell.vue";

export default defineComponent({
  name: "ItemCellPanel",
  components: {
    ItemCell,
  },
  setup() {
    const nullItem: VItem = {
      name: "",
    };

    const selectItemStyle = computed(() => ({
      backgroundColor: vrun.get("color.background3"),
    }));

    const scrollbarStyle = computed(() => {
      const items = vrun.items;
      const itemsHeight = vrun.get("item.max") * vrun.get("cell.height");
      const barHeight = itemsHeight * (vrun.get("item.max") / items.length);
      const barTop =
        ((itemsHeight - barHeight) * vrun.visibleStartIdx.value) /
        (items.length - vrun.visibleItemsNum.value);
      return {
        display: items.length > vrun.get("item.max") ? undefined : "none",
        height: barHeight + "px",
        top: vrun.get("cell.height") + barTop + "px",
      };
    });

    const whenSelectInput = () => {
      switch (vrun.selectInputStr.value) {
        case vrun.get("keymap.selectDown"):
          vrun.selectDown();
          break;
        case vrun.get("keymap.selectUp"):
          vrun.selectUp();
          break;
        case vrun.get("keymap.selectPageDown"):
          vrun.selectPageDown();
          break;
        case vrun.get("keymap.selectPageUp"):
          vrun.selectPageUp();
          break;
        case vrun.get("keymap.selectFirst"):
          vrun.selectFirst();
          break;
        case vrun.get("keymap.selectLast"):
          vrun.selectLast();
          break;
        case vrun.get("keymap.select2type"):
          vrun.focusTypeInput();
          break;
        case vrun.get("keymap.selectEnter"):
          vrun.onEnter();
          break;
        case vrun.get("keymap.selectExit"):
          vrun.onExit();
          break;
      }
      vrun.selectInputStr.value = "";
    };

    return {
      maxVisibleItemsNum: vrun.maxVisibleItemsNum,
      visibleItemsNum: vrun.visibleItemsNum,
      visibleStartIdx: vrun.visibleStartIdx,
      selectIdx: vrun.selectIdx,
      selectItemStyle,
      nullItem,
      items: vrun.items,
      scrollbarStyle,
      selectInput: vrun.selectInput,
      selectInputStr: vrun.selectInputStr,
      whenSelectInput,
      onEnter: vrun.onEnter,
    };
  },
});
</script>

<style>
#select_input {
  position: fixed;
  left: 0px;
  top: 0px;
  opacity: 0;
}
#scrollbar {
  position: absolute;
  right: 0px;
  width: 5px;
  background-color: black;
  opacity: 0.2;
}
</style>
