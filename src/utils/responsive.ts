export function getColumns(containerWidth: number): number {
  if (containerWidth <= 480) return 1;
  if (containerWidth <= 768) return 2;
  if (containerWidth <= 1200) return 3;
  return 4;
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
