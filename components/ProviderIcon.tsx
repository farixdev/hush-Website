import type { IconType } from "react-icons";
import { SiGithub, SiMega, SiMediafire, SiGoogledrive } from "react-icons/si";
import type { ProviderKey } from "@/lib/providers";

const ICONS: Record<ProviderKey, IconType> = {
  github: SiGithub,
  mega: SiMega,
  mediafire: SiMediafire,
  gdrive: SiGoogledrive,
};

export function ProviderIcon({
  provider,
  size = 20,
}: {
  provider: ProviderKey;
  size?: number;
}) {
  const Icon = ICONS[provider];
  return <Icon size={size} />;
}
