export type DownloadPlatform = "windows" | "mac" | "linux";

export const GITHUB_REPO = "Bhaskar-J-Pathak/XVault_Studio";

type DownloadConfig = {
  label: string;
  shortLabel: string;
  fileName: string;
  /** Suffix of the release asset name to match (e.g. "_x64-setup.exe") */
  assetSuffix: string;
  availability: string;
};

export const downloadConfig: Record<DownloadPlatform, DownloadConfig> = {
  windows: {
    label: "Windows",
    shortLabel: "Win",
    fileName: "XVault-Studio-Setup.exe",
    assetSuffix: "_x64-setup.exe",
    availability: "Windows 10+",
  },
  mac: {
    label: "macOS",
    shortLabel: "Mac",
    fileName: "XVault-Studio.dmg",
    assetSuffix: "_aarch64.dmg",   // Apple Silicon; Intel Macs run via Rosetta 2
    availability: "Apple Silicon + Intel",
  },
  linux: {
    label: "Linux",
    shortLabel: "Linux",
    fileName: "XVault-Studio.AppImage",
    assetSuffix: "_amd64.AppImage",
    availability: "AppImage",
  },
};

export function isDownloadPlatform(value: string): value is DownloadPlatform {
  return value in downloadConfig;
}
