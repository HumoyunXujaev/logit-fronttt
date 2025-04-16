'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Import the truck image
import truckImage from '../app/blue.png';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Slightly longer to ensure animation is clearly visible
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <AnimatePresence mode='wait'>
        {isLoading && (
          <motion.div
            key='loading-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='fixed inset-0 pointer-events-none z-50 overflow-hidden bg-white/5 backdrop-blur-[1px]'
          >
            {/* Progress indicator */}
            <motion.div
              className='absolute top-0 left-0 right-0 h-2 bg-blue-600/20'
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <motion.div
                className='absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600 to-blue-600/0'
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Truck animation container - positioned in center of screen */}
            <div className='absolute inset-0 flex items-center justify-center overflow-hidden'>
              {/* Road line */}
              <motion.div
                className='absolute w-screen h-1.5 bg-gray-400/30'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* The animated truck - large and traveling right to left */}
              <motion.div
                initial={{ x: '150%' }}
                animate={{ x: '-150%' }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.3, 0.6, 0.3, 0.9], // Custom easing for a realistic truck movement
                }}
                className='absolute'
                style={{ transform: 'scaleX(-1)' }} // Flip the truck to face left
              >
                <div className='relative'>
                  <Image
                    src={truckImage}
                    alt='Logit Truck'
                    width={320}
                    height={320}
                    priority
                    className='object-contain drop-shadow-xl'
                  />

                  {/* Larger wheel animation */}
                  <motion.div
                    className='absolute -bottom-2 left-16 w-8 h-8 bg-transparent rounded-full border-3 border-gray-500/60'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.7,
                      repeat: 1,
                      repeatType: 'loop',
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className='absolute -bottom-2 right-16 w-8 h-8 bg-transparent rounded-full border-3 border-gray-500/60'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.7,
                      repeat: 1,
                      repeatType: 'loop',
                      ease: 'linear',
                    }}
                  />

                  {/* Subtle shadow beneath the truck */}
                  <motion.div
                    className='absolute -bottom-6 inset-x-0 h-4 bg-black/10 blur-md rounded-full'
                    style={{ width: '80%', marginLeft: '10%' }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
