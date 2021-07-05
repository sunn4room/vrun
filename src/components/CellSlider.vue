<template>
  <div style="display: flex; align-items: center">
    <div class="slider_num" :style="numStyle">{{ value }}</div>
    <span class="slider_runway" :style="runwayStyle">
      <div class="slider_bar" :style="barStyle" />
      <div class="slider_dot" :style="dotStyle" />
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import vrun from "@/vrun";

export default defineComponent({
  name: "CellSlider",
  props: {
    value: {
      type: Number,
      required: true,
    },
    valueDesc: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { value, valueDesc } = toRefs(props);
    const percentage = computed(() => {
      if (value.value < valueDesc.value.min) {
        return 0;
      } else if (value.value > valueDesc.value.max) {
        return 1;
      } else {
        return (
          (value.value - valueDesc.value.min) /
          (valueDesc.value.max - valueDesc.value.min)
        );
      }
    });

    const wayWidth = computed(() => vrun.get("cell.height") * 1.5);

    const numStyle = computed(() => ({
      lineHeight: vrun.get("cell.height") * 0.7 + "px",
      fontSize: vrun.get("cell.height") * 0.3 + "px",
      color: vrun.get("color.foreground2"),
      marginLeft: vrun.get("cell.height") * 0.2 + "px",
    }));

    const runwayStyle = computed(() => ({
      width: wayWidth.value + "px",
      height: vrun.get("cell.height") * 0.1 + "px",
      borderRadius: vrun.get("cell.height") * 0.05 + "px",
      backgroundColor: vrun.get("color.foreground2"),
      margin: vrun.get("cell.height") * 0.3 + "px",
    }));

    const barStyle = computed(() => ({
      width: wayWidth.value * percentage.value + "px",
      height: vrun.get("cell.height") * 0.1 + "px",
      borderRadius: vrun.get("cell.height") * 0.05 + "px",
      backgroundColor: vrun.get("color.foreground3"),
    }));

    const dotStyle = computed(() => ({
      backgroundColor: vrun.get("color.background1"),
      width: vrun.get("cell.height") * 0.2 + "px",
      height: vrun.get("cell.height") * 0.2 + "px",
      border: "2px solid " + vrun.get("color.foreground3"),
      borderRadius: vrun.get("cell.height") * 0.1 + "px",
      left: -vrun.get("cell.height") * 0.1 + "px",
      position: "relative",
    }));

    return {
      numStyle,
      runwayStyle,
      barStyle,
      dotStyle,
    };
  },
});
</script>

<style scoped>
.slider_num {
  display: inline-block;
}
.slider_runway {
  display: inline-flex;
  align-items: center;
}
</style>
