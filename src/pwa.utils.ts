let deferredPrompt: any = null;

export function initPWAInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

export async function promptInstall() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
}
