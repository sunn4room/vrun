<template>
  <main-cell />
  <item-cell-panel />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainCell from "./MainCell.vue";
import ItemCellPanel from "./ItemCellPanel.vue";

export default defineComponent({
  name: "App",
  components: {
    MainCell,
    ItemCellPanel,
  },
});
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
  overflow-y: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input {
  font-family: inherit;
}
</style>
