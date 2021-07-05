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
      <div style="display: flex; align-items: center">
        <component
          v-show="item.value !== undefined"
          :is="'cell-' + valueType"
          :value="item.value"
          :valueDesc="item.valueDesc || {}"
        />
        <div
          class="message_input_container"
          :style="messageInputContainerStyle"
        >
          <input
            class="message_input"
            :style="messageInputStyle"
            ref="messageInput"
            v-model="messageInputStr"
            @focus="whenFocus"
            @blur="whenBlur"
          />
        </div>
      </div>
    </template>
  </cell>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";
import vrun from "@/vrun";
import { VItem } from "@/vrun/item";
import Cell from "@/components/Cell.vue";
import CellAny from "@/components/CellAny.vue";
import CellSwitch from "@/components/CellSwitch.vue";
import CellSlider from "@/components/CellSlider.vue";
import CellColor from "@/components/CellColor.vue";
import CellImg from "@/components/CellImg.vue";

export default defineComponent({
  name: "ItemCell",
  components: {
    Cell,
    CellAny,
    CellSwitch,
    CellSlider,
    CellColor,
    CellImg,
  },
  props: {
    item: {
      type: Object as PropType<VItem>,
      required: true,
    },
    index: {
      type: Number,
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

    const { item, index } = toRefs(props);
    const valueType = computed(() => {
      if (item.value.valueDesc !== undefined) {
        return item.value.valueDesc.type;
      } else {
        return "any";
      }
    });

    const messageInput = ref<HTMLInputElement>();
    const messageInputStr = ref("");
    vrun.messageInputs[index.value] = messageInput;
    vrun.messageInputStrs[index.value] = messageInputStr;
    const messageSwitch = ref(false);
    const messageInputContainerStyle = computed(() => ({
      width: messageSwitch.value ? vrun.get("cell.width") * 0.3 + "px" : "0px",
      height: vrun.get("cell.height") + "px",
    }));
    const messageInputStyle = computed(() => {
      const height = vrun.get("cell.height");
      const width = vrun.get("cell.width");
      return {
        left: height! * 0.2 + "px",
        top: height! * 0.2 + "px",
        width: width * 0.3 - height! * 0.4 + "px",
        height: height! * 0.6 + "px",
        fontSize: height! * 0.3 + "px",
        border: "2px solid " + vrun.get("color.foreground3"),
        backgroundColor: vrun.get("color.background1"),
      };
    });

    const whenFocus = () => {
      messageSwitch.value = true;
    };

    const whenBlur = () => {
      messageSwitch.value = false;
    };

    return {
      itemCellStyle,
      nameStyle,
      descriptionStyle,
      curPlugin: vrun.curPlugin,
      valueType,
      messageInput,
      messageInputStr,
      messageInputContainerStyle,
      messageInputStyle,
      whenFocus,
      whenBlur,
    };
  },
});
</script>

<style scoped>
.message_input_container {
  position: relative;
  overflow: hidden;
  transition: 0.5s width;
}

.message_input {
  position: absolute;
  outline: none;
}

.item_name,
.item_description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
