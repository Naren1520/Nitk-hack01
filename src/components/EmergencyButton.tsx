import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Shield, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface EmergencyButtonProps {
  onEmergencyTriggered?: () => void;
}

export default function EmergencyButton({ onEmergencyTriggered }: EmergencyButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const HOLD_DURATION = 3000; // 3 seconds

  const handleMouseDown = () => {
    if (isTriggered) return;
    
    setIsPressed(true);
    setHoldProgress(0);
    
    const startTime = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
    }, 50);

    timeoutRef.current = setTimeout(() => {
      triggerEmergency();
    }, HOLD_DURATION);
  };

  const handleMouseUp = () => {
    if (isTriggered) return;
    
    setIsPressed(false);
    setHoldProgress(0);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const triggerEmergency = () => {
    setIsTriggered(true);
    setIsPressed(false);
    setHoldProgress(100);
    
    // Clear intervals
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Show success message
    toast.success('🚨 Emergency alert sent! Security has been notified and will respond immediately.', {
      duration: 8000,
    });
    
    // Simulate emergency response
    setTimeout(() => {
      toast.info('📍 Location shared with campus security', { duration: 5000 });
    }, 2000);
    
    setTimeout(() => {
      toast.info('📞 Emergency contacts have been notified', { duration: 5000 });
    }, 4000);
    
    // Call callback
    if (onEmergencyTriggered) {
      onEmergencyTriggered();
    }
    
    // Reset after 10 seconds
    setTimeout(() => {
      setIsTriggered(false);
      setHoldProgress(0);
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="text-center p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
      <div className="relative inline-block">
        <motion.div
          className="relative"
          animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          <Button
            size="lg"
            className={`w-32 h-32 rounded-full text-white text-lg font-bold shadow-lg relative overflow-hidden transition-all duration-200 ${
              isTriggered 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={isTriggered}
          >
            {/* Progress Circle */}
            <div className="absolute inset-0 rounded-full">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="4"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - holdProgress / 100)}`}
                  className="transition-all duration-75 ease-linear"
                />
              </svg>
            </div>

            {/* Button Content */}
            <div className="relative z-10 text-center">
              {isTriggered ? (
                <>
                  <Phone className="h-8 w-8 mx-auto mb-1" />
                  <div className="text-sm leading-tight">CALLING</div>
                  <div className="text-sm leading-tight">SECURITY</div>
                </>
              ) : (
                <>
                  <Shield className="h-8 w-8 mx-auto mb-1" />
                  <div className="text-sm leading-tight">EMERGENCY</div>
                </>
              )}
            </div>
          </Button>

          {/* Pulsing rings when pressed */}
          {isPressed && !isTriggered && (
            <>
              <motion.div
                className="absolute inset-0 w-32 h-32 rounded-full border-4 border-red-300"
                animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 w-32 h-32 rounded-full border-4 border-red-400"
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
              />
            </>
          )}

          {/* Success indicator */}
          {isTriggered && (
            <motion.div
              className="absolute inset-0 w-32 h-32 rounded-full border-4 border-green-400"
              animate={{ scale: [1, 1.2], opacity: [0.8, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.div>
      </div>

      <div className="mt-4 space-y-1">
        {isTriggered ? (
          <div className="text-sm text-green-700 font-medium">
            ✅ Emergency alert sent successfully!
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Press and hold for 3 seconds to activate
            </p>
            {isPressed && (
              <motion.p 
                className="text-sm text-red-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Hold to call security... {Math.ceil((3 - holdProgress / 100 * 3) * 10) / 10}s
              </motion.p>
            )}
          </>
        )}
      </div>
    </div>
  );
}