import { useInstallPrompt } from "./useInstallPrompt";
import {
  isAndroid,
  isStandalone,
  wasInstallDismissed,
  markInstallDismissed,
} from "./pwa.utils";

export function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();

  // filtros profissionais
  if (
    !canInstall ||
    !isAndroid() ||
    isStandalone() ||
    wasInstallDismissed()
  ) {
    return null;
  }

  return (
    <div className="install-banner">
      <span>Install Praise FM App 📻</span>

      <div>
        <button onClick={install}>Install</button>
        <button onClick={markInstallDismissed}>Not now</button>
      </div>
    </div>
  );
}
