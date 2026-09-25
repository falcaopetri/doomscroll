const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;
const PDF_EXT_RE = /\.pdf$/i;
const VIDEO_EXT_RE = /\.(mp4|webm|ogv|mov|m4v)$/i;

export function isImagePath(path: string): boolean {
  return IMAGE_EXT_RE.test(path.split(/[?#]/)[0] ?? path);
}

export function isPdfPath(path: string): boolean {
  return PDF_EXT_RE.test(path.split(/[?#]/)[0] ?? path);
}

export function isVideoPath(path: string): boolean {
  return VIDEO_EXT_RE.test(path.split(/[?#]/)[0] ?? path);
}

export function attachmentLabel(path: string): string {
  if (isImagePath(path) || isPdfPath(path) || isVideoPath(path)) return '';

  const extension = path.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  return extension ? `📎 ${extension.toUpperCase()} attached` : '📎 File attached';
}
