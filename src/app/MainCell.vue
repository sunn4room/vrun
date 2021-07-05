<template>
  <cell id="main_cell">
    <template v-slot:head>
      <cell-img id="plugin_icon" :value="curPlugin.icon" />
    </template>
    <template v-slot:main>
      <input
        id="type_input"
        :style="typeInputStyle"
        spellcheck="false"
        autofocus="autofocus"
        ref="typeInput"
        v-model="typeInputStr"
        @input="whenTypeInput"
        @keyup.enter="onEnter"
      />
    </template>
    <template v-slot:tail>
      <cell-any id="plugin_name" :value="curPlugin.name" />
    </template>
  </cell>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import vrun from "@/vrun";
import Cell from "@/components/Cell.vue";
import CellImg from "@/components/CellImg.vue";
import CellAny from "@/components/CellAny.vue";

export default defineComponent({
  name: "MainCell",
  components: {
    Cell,
    CellImg,
    CellAny,
  },
  setup() {
    const mainCellStyle = computed(() => ({
      backgroundColor: vrun.get("color.background1"),
    }));

    const typeInputStyle = computed(() => ({
      height: vrun.get("cell.height") + "px",
      color: vrun.get("color.foreground1"),
      fontSize: vrun.get("cell.height") * 0.4 + "px",
    }));

    const keylist = computed(() => {
      return [vrun.get("keymap.type2select"), vrun.get("keymap.typeClear")];
    });
    let mem = "";
    let tid: any;
    const whenTypeInput = (e: InputEvent) => {
      if (e.inputType === "insertText") {
        const c = vrun.typeInputStr.value.substring(
          vrun.typeInputStr.value.length - 1
        );
        if (mem === "" && keylist.value.includes(c)) {
          mem = c;
          tid = setTimeout(() => {
            mem = "";
            vrun.doQuery(vrun.typeInputStr.value);
          }, vrun.get("keymap.typeInterval"));
          return;
        } else if (mem === c) {
          clearTimeout(tid);
          vrun.typeInputStr.value = vrun.typeInputStr.value.slice(0, -2);
          mem = "";
          if (c === vrun.get("keymap.type2select")) {
            if (vrun.items.length !== 0) {
              vrun.focusSelectInput();
            }
          } else {
            vrun.typeInputStr.value = "";
            vrun.doQuery("");
          }
          return;
        }
      }
      mem = "";
      vrun.doQuery(vrun.typeInputStr.value);
    };

    return {
      curPlugin: vrun.curPlugin,
      typeInput: vrun.typeInput,
      typeInputStr: vrun.typeInputStr,
      mainCellStyle,
      typeInputStyle,
      whenTypeInput,
      onEnter: vrun.onEnter,
    };
  },
});
</script>

<style>
#type_input {
  width: 100%;
  outline: none;
  border: none;
  background-color: rgba(0, 0, 0, 0);
}
</style>
