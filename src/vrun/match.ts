export function orderMatch(src: string, tgt: string): boolean {
  src = src.toLowerCase();
  tgt = tgt.toLowerCase();
  let idx = 0;
  for (let i = 0; i < src.length; i++) {
    const newidx = tgt.indexOf(src[i], idx);
    if (newidx === -1) {
      return false;
    } else {
      idx = newidx + 1;
    }
  }
  return true;
}
