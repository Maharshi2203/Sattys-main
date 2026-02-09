'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/ui/logo'

export function SplashScreen() {
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if splash has been shown in this session
    const hasShown = sessionStorage.getItem('splash-shown')
    if (hasShown) {
      setShow(false)
      return
    }

    // Show splash on first load
    setShow(true)

    const timer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('splash-shown', 'true')
    }, 5000) // 5 seconds duration

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.05, 1],
              opacity: 1,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              times: [0, 0.6, 1]
            }}
            className="flex flex-col items-center gap-14 w-full max-w-[400px] px-10"
          >
            {/* The Exact Full 'Satty's' Script Logo Image */}
            <div className="relative group w-full aspect-[2/1]">
              <motion.div
                className="w-full h-full"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Logo className="w-full h-full" />
              </motion.div>

              {/* Premium Background Glow */}
              <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10 rounded-full scale-110" />
            </div>

            {/* Synchronized Loading Bar */}
            <div className="w-full max-w-[280px] px-4">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 4.2,
                    ease: [0.65, 0, 0.35, 1],
                    delay: 0.3
                  }}
                  className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(200,16,43,0.3)]"
                />

                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 }}
                className="text-center mt-8 text-[11px] uppercase tracking-[0.6em] font-black text-primary/70"
              >
                Syncing with Excellence
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
