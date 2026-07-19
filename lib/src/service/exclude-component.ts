export const ExcludeTagSet = new Set<string>();
export function excludeTag(tag: string, remove?: boolean) {
  if (remove) {
    ExcludeTagSet.delete(tag);
  } else {
    ExcludeTagSet.add(tag);
  }
}
export function resetTag() {
  ExcludeTagSet.clear();
}
