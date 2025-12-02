export function truncate(str: string | any[], max = 255, ellipsis = false) {
  if (!str) {
    return str;
  }
  if (str.length <= max) {
    return str;
  }
  return ellipsis ? `${str.slice(0, max - 3)}...` : str.slice(0, max);
}
