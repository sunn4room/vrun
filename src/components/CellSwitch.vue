<template>
  <div class="switch_frame" :style="frameStyle">
    <div class="switch_dot" :style="dotStyle" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import vrun from "@/vrun";

export default defineComponent({
  name: "CellSwitch",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const { value } = toRefs(props);
    console.log(value.value);
    const frameStyle = computed(() => ({
      backgroundColor: value.value
        ? vrun.get("color.foreground3")
        : vrun.get("color.foreground2"),
      width: vrun.get("cell.height") * 0.6 + "px",
      height: vrun.get("cell.height") * 0.3 + "px",
      borderRadius: vrun.get("cell.height") * 0.15 + "px",
      margin: vrun.get("cell.height") * 0.2 + "px",
    }));
    const dotStyle = computed(() => ({
      backgroundColor: vrun.get("color.background1"),
      width: vrun.get("cell.height") * 0.24 + "px",
      height: vrun.get("cell.height") * 0.24 + "px",
      borderRadius: vrun.get("cell.height") * 0.12 + "px",
      margin: vrun.get("cell.height") * 0.03 + "px",
      float: value.value ? "right" : "left",
    }));

    return {
      frameStyle,
      dotStyle,
    };
  },
});
</script>
