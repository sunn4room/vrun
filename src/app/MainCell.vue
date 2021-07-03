<template>
  <cell id="main_cell">
    <cell-icon :url="''" />
  </cell>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cell from "@/components/Cell.vue";
import CellIcon from "@/components/CellIcon.vue";

export default defineComponent({
  name: "MainCell",
  components: {
    Cell,
    CellIcon,
  },
  setup() {
    //
  },
});
</script>
