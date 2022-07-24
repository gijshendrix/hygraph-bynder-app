export function noop() {
  return undefined;
}

export type File = {
  url: string;
  width: string;
  height: string;
  fileSize: string;
}

export type Media = {
  databaseId: string;
  name: string;
  description: string;
  type: string;
  files: {
    [key: string] : File
  }
  previewUrls: string[];
};

export function isMediaType(item: any): item is Media {
  return Boolean(item) && "databaseId" in item && "type" in item;
}

export function isMediaList(media: Media | Media[] | string): media is Media[] {
  return (
    Array.isArray(media) &&
    media.length > 0 &&
    media.every((item) => isMediaType(item))
  );
}

// export function formatBytes(bytes: number, decimals = 2) {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024,
//     dm = decimals || 2,
//     sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
//     i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
// }
