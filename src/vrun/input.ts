import { ref } from "vue";

export const typeInput = ref<HTMLInputElement>();
export const typeInputStr = ref("");
export function focusTypeInput(): void {
  typeInput.value!.focus();
}

export const selectInput = ref<HTMLInputElement>();
export const selectInputStr = ref("");
export function focusSelectInput(): void {
  selectInput.value!.focus();
}
