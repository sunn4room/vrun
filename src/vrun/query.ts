import { computed, ref, watch } from "vue";
import _ from "lodash";
import { plugin } from "./plugin";
import { get } from "./config";
import { Log } from "./util";

const logger = Log.getLogger("query");

export function doQuery(queryStr: string): void {
  query.value = queryStr;
  logger.trace("do query:", queryStr);
}

const query = ref("");
const keyword = ref("");
const searchword = ref("");
export const curPlugin = ref(plugin.get("")!);

// watch query to change keyword and searchword
watch(query, (queryStr) => {
  const trimed = queryStr.replace(/(^\s*)/g, "");
  const idx = trimed.indexOf(" ");
  if (idx !== -1 && plugin.has(trimed.substring(0, idx))) {
    keyword.value = trimed.substring(0, idx);
    searchword.value = trimed.substring(idx).trim();
  } else {
    keyword.value = "";
    searchword.value = trimed.trim();
  }
});

const debounceFunc = computed(() =>
  _.debounce((searchword) => {
    curPlugin.value.search?.(searchword);
  }, curPlugin.value.debounce || get("app.debounce"))
);

// watch keyword and searchword to execute query action
watch([keyword, searchword], ([keyword, searchword], [oldkeyword]) => {
  if (keyword !== oldkeyword) {
    curPlugin.value.beforeLeave?.();
    curPlugin.value = plugin.get(keyword)!;
    logger.trace("curPlugin changed from %s to %s", oldkeyword, keyword);
    curPlugin.value.afterEnter?.();
  }
  debounceFunc.value(searchword);
  logger.trace("search with %s", searchword);
});
