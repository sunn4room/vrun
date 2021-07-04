<template>
  <div class="cell" :style="cellStyle">
    <div class="cell_head"><slot name="head" /></div>
    <div class="cell_main"><slot name="main" /></div>
    <div class="cell_tail"><slot name="tail" /></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import vrun from "@/vrun";

export default defineComponent({
  name: "Cell",
  setup() {
    const cellStyle = computed(() => ({
      width: vrun.get("cell.width") + "px",
      height: vrun.get("cell.height") + "px",
      fontFamily: vrun.get("app.font"),
    }));

    return {
      cellStyle,
    };
  },
});
</script>

<style scoped>
.cell {
  display: flex;
  align-items: center;
}

.cell_main {
  flex-grow: 1;
}
</style>
