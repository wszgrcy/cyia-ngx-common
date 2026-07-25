export const ExcludeTagSet = new Set<string>();
export function selectorlessExcludeTag(tag: string, remove?: boolean) {
  if (remove) {
    ExcludeTagSet.delete(tag);
  } else {
    ExcludeTagSet.add(tag);
  }
}
export function selectorlessResetTag() {
  ExcludeTagSet.clear();
}
export let ExcludeTagFunction: (name: string) => boolean;
export function setSelectorlessFilter(fn: (name: string) => boolean) {
  ExcludeTagFunction = fn;
}
