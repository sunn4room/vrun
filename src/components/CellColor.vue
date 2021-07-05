<template>
  <div class="color" :style="colorStyle" />
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import vrun from "@/vrun";

export default defineComponent({
  name: "CellColor",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { value } = toRefs(props);
    const colorStyle = computed(() => ({
      backgroundColor: value.value,
      border: "2px solid " + vrun.get("color.foreground2"),
      width: vrun.get("cell.height") * 0.3 + "px",
      height: vrun.get("cell.height") * 0.3 + "px",
      borderRadius: vrun.get("cell.height") * 0.15 + "px",
      margin: vrun.get("cell.height") * 0.2 + "px",
    }));

    return {
      colorStyle,
    };
  },
});
</script>
