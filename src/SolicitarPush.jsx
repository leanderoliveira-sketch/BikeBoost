import React, { useEffect } from 'react';

const SolicitarPush = () => {
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  return null;
};

export default SolicitarPush;