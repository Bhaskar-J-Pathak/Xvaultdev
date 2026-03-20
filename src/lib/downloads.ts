export type DownloadPlatform = "windows" | "mac" | "linux";

const GITHUB_REPO = "Bhaskar-J-Pathak/XVault_Studio";

type DownloadConfig = {
  label: string;
  shortLabel: string;
  fileName: string;
  assetId?: number;
  availability: string;
};

export const downloadConfig: Record<DownloadPlatform, DownloadConfig> = {
  windows: {
    label: "Windows",
    shortLabel: "Win",
    fileName: "XVault-Studio-Setup.exe",
    assetId: process.env.DOWNLOAD_ASSET_ID_WINDOWS
      ? Number(process.env.DOWNLOAD_ASSET_ID_WINDOWS)
      : undefined,
    availability: "Windows 10+",
  },
  mac: {
    label: "macOS",
    shortLabel: "Mac",
    fileName: "XVault-Studio.dmg",
    assetId: process.env.DOWNLOAD_ASSET_ID_MAC
      ? Number(process.env.DOWNLOAD_ASSET_ID_MAC)
      : undefined,
    availability: "Apple Silicon + Intel",
  },
  linux: {
    label: "Linux",
    shortLabel: "Linux",
    fileName: "XVault-Studio.AppImage",
    assetId: process.env.DOWNLOAD_ASSET_ID_LINUX
      ? Number(process.env.DOWNLOAD_ASSET_ID_LINUX)
      : undefined,
    availability: "AppImage",
  },
};

export function isDownloadPlatform(value: string): value is DownloadPlatform {
  return value in downloadConfig;
}

export function getAssetApiUrl(assetId: number): string {
  return `https://api.github.com/repos/${GITHUB_REPO}/releases/assets/${assetId}`;
}
