import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/30',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      progress: 'bg-emerald-500'
    },
    error: {
      bg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-500/30',
      text: 'text-rose-800 dark:text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-500" />,
      progress: 'bg-rose-500'
    },
    info: {
      bg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-500/30',
      text: 'text-sky-800 dark:text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-500" />,
      progress: 'bg-sky-500'
    }
  };

  const config = typeConfig[toast.type || 'info'];

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex flex-col w-80 md:w-96 rounded-xl border p-4 shadow-xl backdrop-blur-md ${config.bg} ${config.text} overflow-hidden`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
              <div className="flex-grow">
                <p className="text-sm font-medium pr-4 break-words leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 opacity-60 hover:opacity-100" />
              </button>
            </div>
            
            {/* Animated Time Progress bar */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-1 ${config.progress}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
