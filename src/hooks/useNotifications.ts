import { useCallback } from 'react';

const DEMO_CRIME_TYPES = [
  'ұрлық',
  'қарақшылық',
  'шабуыл',
  'алаяқтық',
  'вандализм',
  'есірткіге байланысты құқық бұзушылық',
];

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
    const pulseDuration = 0.25;

    for (let i = 0; i < 4; i += 1) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const startTime = now + i * pulseDuration;
      const endTime = startTime + pulseDuration;

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(i % 2 === 0 ? 880 : 660, startTime);

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.35, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    }

    setTimeout(() => {
      audioContext.close();
    }, 1500);
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
        icon: 'https://img.icons8.com/color/512/police-badge.png',
        badge: 'https://img.icons8.com/color/512/police-badge.png',
        vibrate: [200, 100, 200],
        data: { url }
      } as any);
    } else if (hasPermission) {
      new Notification(title, { body });
    }
  }, [playAlarmSound, requestPermission]);

  const sendDemoCrimeAlert = useCallback(async () => {
    const randomType = DEMO_CRIME_TYPES[Math.floor(Math.random() * DEMO_CRIME_TYPES.length)];
    const body = `Назар аударыңыз: жақын маңда ${randomType} фактісі тіркелді.`;

    await sendNotification('DEREU Демо тревога', body, '/notifications', true);
  }, [sendNotification]);

  return { requestPermission, sendNotification, sendDemoCrimeAlert, playAlarmSound };
};
