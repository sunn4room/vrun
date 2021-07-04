<template>
  <img
    class="cell_img"
    :style="iconStyle"
    :src="value"
    :onerror="onErrorScript"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import vrun from "@/vrun";
import onError from "@/assets/onerror.png";

export default defineComponent({
  name: "CellImg",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup() {
    const iconStyle = computed(() => {
      const cellHeight = vrun.get("cell.height");
      return {
        width: cellHeight + "px",
        height: cellHeight + "px",
        padding: cellHeight * 0.15 + "px",
      };
    });

    const onErrorScript = "this.src='" + onError + "'";

    return {
      iconStyle,
      onErrorScript,
    };
  },
});
</script>
