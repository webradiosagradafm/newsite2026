import { useInstallPrompt } from './useInstallPrompt';
import {
  isIOS,
  isAndroid,
  isStandalone,
  wasInstallDismissed,
  markInstallDismissed,
  shouldShowAgainAfterDismiss,
} from './pwa.utils';

export function InstallBanner() {
  const { canInstall, install } = useInstallPrompt();

  // Se já está instalado, não mostra nada
  if (isStandalone()) return null;

  // Se o banner foi dispensado e ainda não expirou, não mostra
  if (wasInstallDismissed() && !shouldShowAgainAfterDismiss()) return null;

  // --- iOS: mostra instruções de instalação manual ---
  if (isIOS()) {
    return (
      <div className="install-banner">
        <div className="install-banner-content">
          <span>📱 Add Praise FM to Home Screen</span>
          <p>
            Tap <strong>Share</strong> <span role="img" aria-label="share icon">⎋</span> then{' '}
            <strong>Add to Home Screen</strong>.
          </p>
        </div>
        <div className="install-banner-actions">
          <button onClick={markInstallDismissed}>Not now</button>
        </div>
      </div>
    );
  }

  // --- Android: botão de instalação nativa ---
  if (canInstall && isAndroid()) {
    return (
      <div className="install-banner">
        <span>📻 Install Praise FM App</span>
        <div>
          <button onClick={install}>Install</button>
          <button onClick={markInstallDismissed}>Not now</button>
        </div>
      </div>
    );
  }

  return null;
}