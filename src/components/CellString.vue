<template>
  <div class="cell_string" :style="stringStyle">{{ value }}</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import vrun from "@/vrun";

export default defineComponent({
  name: "CellString",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup() {
    const stringStyle = computed(() => ({
      fontSize: vrun.get("cell.height") * 0.3 + "px",
      color: vrun.get("color.foreground2"),
      padding: vrun.get("cell.height") * 0.2 + "px",
    }));

    return {
      stringStyle,
    };
  },
});
</script>
