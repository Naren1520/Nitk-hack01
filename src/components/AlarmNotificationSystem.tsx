import { useEffect } from 'react';
import { useSettings } from '../lib/contexts/SettingsContext';
import { toast } from 'sonner@2.0.3';
import { AlarmClock, Bell } from 'lucide-react';

export default function AlarmNotificationSystem() {
  const { settings } = useSettings();

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      settings.alarms.forEach(alarm => {
        if (!alarm.isEnabled) return;
        
        const shouldTrigger = () => {
          if (alarm.time !== currentTime) return false;
          
          switch (alarm.repeat) {
            case 'daily':
              return true;
            case 'weekdays':
              return currentDay >= 1 && currentDay <= 5; // Monday to Friday
            case 'weekly':
              // For weekly, we'd need to store the original day, but for simplicity, treat as daily
              return true;
            case 'none':
              // For one-time alarms, we should disable them after triggering
              return true;
            default:
              return true;
          }
        };

        if (shouldTrigger()) {
          // Show notification
          if (settings.notificationsEnabled) {
            toast(alarm.title, {
              description: `Alarm: ${formatTime(alarm.time)}`,
              icon: <AlarmClock className="h-4 w-4" />,
              duration: 5000,
              action: {
                label: "Dismiss",
                onClick: () => {}
              }
            });

            // Play sound if enabled
            if (settings.soundEnabled) {
              playAlarmSound();
            }

            // Request browser notification permission and show notification
            if ('Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification(`Campus Link Alarm: ${alarm.title}`, {
                  body: `Time: ${formatTime(alarm.time)}`,
                  icon: '/favicon.ico',
                  tag: `alarm-${alarm.id}`,
                  requireInteraction: true
                });
              } else if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    new Notification(`Campus Link Alarm: ${alarm.title}`, {
                      body: `Time: ${formatTime(alarm.time)}`,
                      icon: '/favicon.ico',
                      tag: `alarm-${alarm.id}`,
                      requireInteraction: true
                    });
                  }
                });
              }
            }
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkAlarms, 60000);
    
    // Also check immediately
    checkAlarms();

    return () => clearInterval(interval);
  }, [settings.alarms, settings.notificationsEnabled, settings.soundEnabled]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const playAlarmSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  };

  // This component doesn't render anything, it just handles background alarm checking
  return null;
}