<template>
  <cell class="item_cell" :style="itemCellStyle">
    <template v-slot:head>
      <cell-img id="item_icon" :value="item.icon || curPlugin.icon" />
    </template>
    <template v-slot:main>
      <div class="item_name" :style="nameStyle">
        {{ item.name }}
      </div>
      <div
        class="item_description"
        v-show="item.description"
        :style="descriptionStyle"
      >
        {{ item.description }}
      </div>
    </template>
    <template v-slot:tail>
      <component
        v-show="item.value !== undefined"
        :is="'cell-' + valueType"
        :value="item.value || ''"
      />
    </template>
  </cell>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";
import vrun from "@/vrun";
import { VItem } from "@/vrun/item";
import Cell from "@/components/Cell.vue";
import CellImg from "@/components/CellImg.vue";
import CellString from "@/components/CellString.vue";

export default defineComponent({
  name: "ItemCell",
  components: {
    Cell,
    CellImg,
    CellString,
  },
  props: {
    item: {
      type: Object as PropType<VItem>,
      required: true,
    },
  },
  setup(props) {
    const itemCellStyle = computed(() => ({
      backgroundColor: vrun.get("color.background2"),
    }));
    const nameStyle = computed(() => ({
      fontSize: vrun.get("cell.height") * 0.35 + "px",
      marginBottom: vrun.get("cell.height") * 0.05 + "px",
    }));
    const descriptionStyle = computed(() => ({
      fontSize: vrun.get("cell.height") * 0.25 + "px",
      color: vrun.get("color.foreground2"),
    }));

    const { item } = toRefs(props);
    const valueType = computed(() => {
      if (item.value.valueDesc !== undefined) {
        return item.value.valueDesc.type;
      } else {
        return "string";
      }
    });

    return {
      itemCellStyle,
      nameStyle,
      descriptionStyle,
      curPlugin: vrun.curPlugin,
      valueType,
    };
  },
});
</script>
