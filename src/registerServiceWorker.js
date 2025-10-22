export function registerServiceWorker() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service Worker registrado!', reg);
    });
  }
}