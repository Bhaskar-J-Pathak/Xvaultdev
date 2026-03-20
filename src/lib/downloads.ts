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
    fileName: "XVault-Studio-Setup.exe",
    href: process.env.DOWNLOAD_URL_WINDOWS,
    availability: "Windows 10+",
  },
  mac: {
    label: "macOS",
    shortLabel: "Mac",
    fileName: "XVault-Studio.dmg",
    href: process.env.DOWNLOAD_URL_MAC,
    availability: "Apple Silicon + Intel",
  },
  linux: {
    label: "Linux",
    shortLabel: "Linux",
    fileName: "XVault-Studio.AppImage",
    href: process.env.DOWNLOAD_URL_LINUX,
    availability: "AppImage",
  },
};

export function isDownloadPlatform(value: string): value is DownloadPlatform {
  return value in downloadConfig;
}
