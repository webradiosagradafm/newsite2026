// Detecta iOS
export function isIOS(): boolean {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !("standalone" in window)
  );
}

// Detecta Android
export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

// Detecta mobile em geral
export function isMobile(): boolean {
  return /iphone|ipad|ipod|android/i.test(navigator.userAgent);
}

// App já está instalado?
export function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS legacy
    (window.navigator as any).standalone === true
  );
}

// Usuário já recusou o banner?
export function wasInstallDismissed(): boolean {
  return localStorage.getItem("pwa-install-dismissed") === "true";
}

// Marca como recusado
export function markInstallDismissed() {
  localStorage.setItem("pwa-install-dismissed", "true");
}
