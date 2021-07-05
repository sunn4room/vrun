<template>
  <div class="cell_any" :style="anyStyle">{{ value }}</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import vrun from "@/vrun";

export default defineComponent({
  name: "CellAny",
  props: ["value"],
  setup() {
    const anyStyle = computed(() => ({
      fontSize: vrun.get("cell.height") * 0.3 + "px",
      color: vrun.get("color.foreground2"),
      padding: vrun.get("cell.height") * 0.2 + "px",
      maxWidth: vrun.get("cell.width") * 0.3 + "px",
    }));

    return {
      anyStyle,
    };
  },
});
</script>

<style scoped>
.cell_any {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
