/**
 * 判断是否是外链
 * @category Url
 */
export function isExternalLink(url?: string | null): boolean {
  return !!(
    url &&
    (url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("//"))
  );
}
