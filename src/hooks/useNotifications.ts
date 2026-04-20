import { useCallback } from 'react';

const DEMO_CRIME_TYPES = [
  'ұрлық',
  'қарақшылық',
  'шабуыл',
  'алаяқтық',
  'вандализм',
  'есірткіге байланысты құқық бұзушылық',
];

const PUSH_PUBLIC_KEY = import.meta.env.VITE_PUSH_PUBLIC_KEY;

const toUint8Array = (base64: string) => {
  const normalized = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const raw = window.atob(normalized);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
};

export const useNotifications = () => {
  const playAlarmSound = useCallback(async () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const now = audioContext.currentTime;
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.65, now);
    masterGain.connect(audioContext.destination);

    for (let i = 0; i < 6; i += 1) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const startTime = now + i * 0.34;
      const endTime = startTime + 0.3;
      const highTone = i % 2 === 0 ? 1240 : 980;
      const lowTone = i % 2 === 0 ? 720 : 560;

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(highTone, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(lowTone, endTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, startTime);
      filter.frequency.exponentialRampToValueAtTime(700, endTime);
      filter.Q.setValueAtTime(1.4, startTime);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.5, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGain);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    }

    if ('vibrate' in navigator) {
      navigator.vibrate([300, 120, 300, 120, 500]);
    }

    setTimeout(() => {
      audioContext.close();
    }, 2600);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Бұл браузерде хабарландыруларға қолдау жоқ');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const sendNotification = useCallback(async (
    title: string,
    body: string,
    url: string = '/',
    withAlarmSound: boolean = false
  ) => {
    if (withAlarmSound) {
      await playAlarmSound();
    }

    const hasPermission = await requestPermission();
    
    if (hasPermission && 'serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      
      // In a real app, this would come from a server push
      // For this prototype, we're triggering it locally
      registration.showNotification(title, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [300, 120, 300, 120, 500],
        data: { url }
      } as any);
    } else if (hasPermission) {
      new Notification(title, { body });
    }
  }, [playAlarmSound, requestPermission]);

  const subscribeToPush = useCallback(async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    if (!PUSH_PUBLIC_KEY) {
      console.warn('VITE_PUSH_PUBLIC_KEY орнатылмаған, web-push тіркелмеді');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: toUint8Array(PUSH_PUBLIC_KEY),
      });
    }

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription }),
    });

    return response.ok;
  }, [requestPermission]);

  const sendRemotePush = useCallback(async (title: string, body: string, url: string) => {
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url }),
    });

    return response.ok;
  }, []);

  const sendDemoCrimeAlert = useCallback(async () => {
    const randomType = DEMO_CRIME_TYPES[Math.floor(Math.random() * DEMO_CRIME_TYPES.length)];
    const body = `Назар аударыңыз: жақын маңда ${randomType} фактісі тіркелді.`;

    await playAlarmSound();

    try {
      const subscribed = await subscribeToPush();
      if (subscribed) {
        const sent = await sendRemotePush('DEREU Демо тревога', body, '/notifications');
        if (sent) {
          return;
        }
      }
    } catch (error) {
      console.warn('Push жіберу қатесі, жергілікті хабарламаға ауысу', error);
    }

    await sendNotification('DEREU Демо тревога', body, '/notifications', false);
  }, [playAlarmSound, sendNotification, sendRemotePush, subscribeToPush]);

  return { requestPermission, sendNotification, sendDemoCrimeAlert, playAlarmSound, subscribeToPush };
};
