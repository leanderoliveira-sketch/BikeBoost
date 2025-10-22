import React, { useEffect } from 'react';

export function subscribeToPush(user_id) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: '<YOUR_PUBLIC_KEY_BASE64>'
      })
      .then(sub => {
        fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id, subscription: sub })
        });
      });
    });
  }
}

const PushSubscription = ({ user_id }) => {
  useEffect(() => {
    subscribeToPush(user_id);
  }, [user_id]);
  return null;
};

export default PushSubscription;