const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;

export function isImagePath(path: string): boolean {
  return IMAGE_EXT_RE.test(path.split(/[?#]/)[0] ?? path);
}

export function attachmentLabel(path: string): string {
  const extension = path.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  return extension ? `📎 ${extension.toUpperCase()} attached` : '📎 File attached';
}
