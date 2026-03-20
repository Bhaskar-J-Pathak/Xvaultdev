export type DownloadPlatform = "windows" | "mac" | "linux";

type DownloadConfig = {
  label: string;
  shortLabel: string;
  fileName: string;
  href?: string;
  availability: string;
};

export const downloadConfig: Record<DownloadPlatform, DownloadConfig> = {
  windows: {
    label: "Windows",
    shortLabel: "Win",
    fileName: "xvault-setup.exe",
    href: process.env.DOWNLOAD_URL_WINDOWS,
    availability: "Windows 10+",
  },
  mac: {
    label: "macOS",
    shortLabel: "Mac",
    fileName: "xvault.dmg",
    href: process.env.DOWNLOAD_URL_MAC,
    availability: "Apple Silicon + Intel",
  },
  linux: {
    label: "Linux",
    shortLabel: "Linux",
    fileName: "xvault.AppImage",
    href: process.env.DOWNLOAD_URL_LINUX,
    availability: "AppImage",
  },
};

export function isDownloadPlatform(value: string): value is DownloadPlatform {
  return value in downloadConfig;
}
