// Detecta iOS (iPhone, iPad, iPod) – apenas SO
export function isIOS(): boolean {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS 13+ pode se apresentar como MacIntel
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

// Detecta Android (apenas SO)
export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

// Detecta mobile em geral
export function isMobile(): boolean {
  return isIOS() || isAndroid();
}

// App já está instalado? (modo standalone)
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Usuário já recusou o banner?
export function wasInstallDismissed(): boolean {
  return localStorage.getItem('pwa-install-dismissed') === 'true';
}

// Marca como recusado (com expiração opcional de 7 dias – melhoria)
export function markInstallDismissed() {
  const expiration = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias
  localStorage.setItem('pwa-install-dismissed', 'true');
  localStorage.setItem('pwa-install-dismissed-timestamp', String(expiration));
}

// Verifica se a recusa expirou (para reapresentar o banner)
export function shouldShowAgainAfterDismiss(): boolean {
  const timestamp = localStorage.getItem('pwa-install-dismissed-timestamp');
  if (!timestamp) return true;
  return Date.now() > Number(timestamp);
}