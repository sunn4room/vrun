<template>
  <div class="cell" :style="cellStyle">
    <slot />
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
</style>
