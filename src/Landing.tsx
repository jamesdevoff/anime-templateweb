import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSoftwareLoadingSound } from './useSoftwareLoadingSound';
import { useAmbientSound } from './useAmbientSound';
import { Dashboard } from './Dashboard';

type Phase = 'loading' | 'welcome' | 'portal';

export function Landing() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const { start: startLoadingSound, stop: stopLoadingSound } = useSoftwareLoadingSound();
  const { start: startAmbient, stop: stopAmbient } = useAmbientSound();
  
  const hasInitializedAudioRef = useRef(false);

  const enableAudio = () => {
    if (hasInitializedAudioRef.current) return;
    hasInitializedAudioRef.current = true;
    setAudioEnabled(true);
    
    if (phase === 'loading') {
      startLoadingSound();
    } else {
      startAmbient();
    }
  };

  useEffect(() => {
    // Attempt to start audio immediately without requiring a click interaction
    if (!hasInitializedAudioRef.current) {
       enableAudio();
    }
  }, [enableAudio]);

  useEffect(() => {
    if (phase === 'loading') {
      const duration = 2500; 
      const intervalMs = 30; 
      const totalSteps = duration / intervalMs;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const currentProgress = Math.floor((currentStep / totalSteps) * 100);
        setProgress(currentProgress > 100 ? 100 : currentProgress);

        if (currentStep >= totalSteps) {
          clearInterval(timer);
          stopLoadingSound();
          if (hasInitializedAudioRef.current) {
             startAmbient();
          }
          setPhase('welcome');
          
          setTimeout(() => {
             setPhase('portal');
          }, 2500);
        }
      }, intervalMs);

      return () => {
        clearInterval(timer);
        stopLoadingSound();
      };
    }
  }, [phase, stopLoadingSound, startAmbient]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#0e121a] text-slate-300 flex flex-col font-sans overflow-hidden relative">
      {/* Global Background Image */}
      <div 
         className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-screen"
         style={{ backgroundImage: "url('https://files.catbox.moe/ocgi20.jpg')" }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none bg-tech-grid opacity-30" />
      
      {/* Dark radial gradient to frame the edges */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0e121a]/60 to-[#0e121a]"></div>

      <AnimatePresence mode="wait">

        {phase === 'loading' && (
          <motion.div
            key="loading"
            className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative w-[85vw] max-w-[600px] aspect-square flex items-center justify-center my-12 z-10">
              {/* background circle */}
              <svg className="absolute inset-0 w-full h-full text-zinc-900/50" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* actual progress circle */}
              <svg className="absolute inset-0 w-full h-full text-[#00e676] rotate-[-90deg] drop-shadow-[0_0_20px_rgba(0,230,118,0.6)]" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1"
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * progress) / 100}
                  className="transition-all duration-75 ease-linear"
                />
              </svg>

              {/* glitch outlines */}
              <svg className="absolute inset-0 w-full h-full text-blue-500 glitch-circle-1 mix-blend-screen pointer-events-none opacity-50" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46.5" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="10 20 40 10" />
              </svg>
              <svg className="absolute inset-0 w-full h-full text-fuchsia-500 glitch-circle-2 mix-blend-screen pointer-events-none opacity-40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="43.5" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="30 10 20 20" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="text-7xl md:text-9xl font-mono font-bold text-white glitch-number tracking-tighter"
                  data-text={`${progress}%`}
                >
                  {progress}%
                </div>
                <div className="mt-6 text-xs md:text-sm text-[#00e676] font-mono tracking-widest uppercase opacity-80 animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00e676] rounded-full inline-block shadow-[0_0_10px_#00e676]"></span>
                  SYSTEM_INITIALIZATION
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Welcome to my portal
            </h2>
            <div className="mt-4 text-[#00e676] font-mono text-sm tracking-widest border border-[#00e676]/30 px-3 py-1 rounded bg-[#00e676]/10">
              AUTH GRANTED
            </div>
          </motion.div>
        )}

        {phase === 'portal' && (
          <motion.div 
            key="portal" 
            className="flex-1 flex flex-col relative z-10 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.header 
              className="absolute top-0 left-0 w-full flex items-center justify-between p-6 md:px-12 md:py-6 bg-[#0f1420]/90 backdrop-blur-md border-b border-white/5 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#f97316] flex items-center justify-center text-white font-black tracking-tighter text-sm shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                  JP
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-bold tracking-tight text-white leading-tight mt-1">James Portal</span>
                  <span className="text-[10px] text-blue-400 font-mono tracking-widest">ACTIVE INSTANCE</span>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-12 text-sm font-medium text-slate-300">
                <a href="#about" className="hover:text-[#00e676] transition-colors font-mono tracking-wider">
                  &lt;About /&gt;
                </a>
                <a href="#projects" className="text-white relative group font-mono tracking-wider">
                  &lt;Showcase /&gt;
                  <span className="absolute -bottom-6 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
                </a>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-all border border-white/10 font-bold text-xs tracking-widest">
                  CONTACT
                </button>
              </nav>
            </motion.header>

            <main className="flex-1 flex flex-col items-center justify-start text-center px-4 mx-auto max-w-6xl relative w-full pt-32 pb-20">
              <Dashboard />
            </main>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
