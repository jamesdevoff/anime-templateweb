import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Projects } from './Projects';

const baseFriends = [
  { id: 1, name: 'James', verified: true, avatar: 'J', color: 'bg-blue-500' },
  { id: 2, name: 'Giddy', verified: false, avatar: 'G', color: 'bg-emerald-500' },
  { id: 3, name: 'Unknown', verified: false, avatar: '?', color: 'bg-slate-500' },
  { id: 4, name: 'Nox', verified: false, avatar: 'N', color: 'bg-purple-500' },
];

const repeatedFriends = Array.from({ length: 4 }).flatMap((_, i) => 
  baseFriends.map(f => ({ ...f, uniqueId: `${f.id}-${i}` }))
);
const marqueeItems = [...repeatedFriends, ...repeatedFriends.map(f => ({ ...f, uniqueId: `${f.uniqueId}-copy` }))];

const ads = [
  { 
    title: "SPONSOR", 
    content: "Subscribe to my official Telegram channel for updates!", 
    actionText: "JOIN CHANNEL",
    actionLink: "https://t.me/jamesBotz3"
  },
  {
    title: "RECOMMENDATION",
    content: "Use my baileys fork on WhatsApp bots for better performance.\n\n\"@whiskeysockets/baileys\": \"github:jamesdevoff/AnimeBails\"",
    actionText: "COPY PACKAGE",
    actionLink: null
  }
];

export function Dashboard() {
  const [view, setView] = useState<'dashboard' | 'projects'>('dashboard');
  const [ip, setIp] = useState<string>('DETECTING...');
  const [battery, setBattery] = useState<{ level: string, charging: boolean | null }>({ level: '--%', charging: null });
  const [location, setLocation] = useState<{ lat: string, lon: string, city?: string }>({ lat: 'WAITING...', lon: 'WAITING...' });
  const [time, setTime] = useState<string>('');
  
  const [showSocials, setShowSocials] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toISOString());
    }, 100);

    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('UNAVAILABLE'));

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        const updateBattery = () => {
          setBattery({
            level: `${Math.round(batt.level * 100)}%`,
            charging: batt.charging
          });
        };
        updateBattery();
        batt.addEventListener('levelchange', updateBattery);
        batt.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    } else {
      setBattery({ level: 'UNSUPPORTED', charging: null });
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lon = pos.coords.longitude.toFixed(4);
          setLocation({
            lat,
            lon
          });
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
            .then(res => res.json())
            .then(data => {
              setLocation(prev => ({ 
                ...prev, 
                city: data.address?.city || data.address?.town || data.address?.village || data.address?.state || 'UNKNOWN LOCATION' 
              }));
            })
            .catch(() => {});
        },
        (err) => {
          setLocation({ lat: 'DENIED', lon: 'DENIED' });
        }
      );
    } else {
      setLocation({ lat: 'UNSUPPORTED', lon: 'UNSUPPORTED' });
    }

    // Ads logic
    const adInterval = setInterval(() => {
      setShowAd(true);
      setTimeout(() => setShowAd(false), 8000);
      setAdIndex(prev => (prev + 1) % ads.length);
    }, 20000);

    return () => {
      clearInterval(timer);
      clearInterval(adInterval);
    };
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === 'projects') {
    return (
      <div className="w-full flex justify-center pb-20 fade-in">
        <Projects onBack={() => setView('dashboard')} />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center pb-20">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8">
        
        {/* Video Card */}
        <motion.div 
          className="w-full max-w-sm rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] p-2 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur">LIVE_FEED</span>
          </div>
          <video 
            src="https://files.catbox.moe/jye1k9.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full aspect-video object-cover rounded-lg mix-blend-screen opacity-90 filter contrast-125 pointer-events-none"
          />
        </motion.div>

        {/* View Projects Big Button */}
        <motion.button
          onClick={() => setView('projects')}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-sm bg-gradient-to-r from-[#00e676]/80 to-emerald-600/80 hover:from-[#00e676] hover:to-emerald-500 border-2 border-[#00e676]/50 text-white rounded-full px-8 py-5 font-black tracking-widest text-xl shadow-[0_0_40px_rgba(0,230,118,0.4)] hover:shadow-[0_0_60px_rgba(0,230,118,0.6)] hover:scale-105 transition-all animate-pulse backdrop-blur-md relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 transform w-full -translate-x-[150%] skew-x-[45deg] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none"></div>
          VIEW PROJECTS
        </motion.button>

        {/* Friends Carousel Card */}
        <motion.div 
          className="w-full max-w-sm rounded-xl overflow-hidden border border-[#1e293b] bg-[#121824]/80 backdrop-blur-sm p-4 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Project Connect
          </div>

          <div className="relative w-full overflow-hidden mask-edges py-1 cursor-ew-resize">
             {/* Gradient masks for smooth edges */}
             <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-[#121824] to-transparent z-10 pointer-events-none"></div>
             <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-[#121824] to-transparent z-10 pointer-events-none"></div>
             
             <div className="animate-marquee flex gap-4 pr-4">
                {marqueeItems.map((friend) => (
                  <div key={friend.uniqueId} className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1.5 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${friend.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                      {friend.avatar}
                    </div>
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      {friend.name}
                      {friend.verified && (
                        <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-7.5 1.5 1.4-7.9 9.1z" />
                        </svg>
                      )}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Personal Details */}
          <div className="bg-[#121824]/80 backdrop-blur-sm border border-[#1e293b] rounded-xl p-5 text-left flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Identity
            </div>
            <div className="text-xl font-bold text-white mb-1">James Portal</div>
            <div className="text-sm font-mono text-slate-400 mb-4">ID: JP-40991-A</div>
            <div className="mt-auto text-[10px] font-mono text-[#00e676] bg-[#00e676]/10 px-2 py-1 rounded inline-block self-start border border-[#00e676]/30">
              STATUS: SECURE_LINK
            </div>
          </div>

          {/* Network */}
          <div className="bg-[#121824]/80 backdrop-blur-sm border border-[#1e293b] rounded-xl p-5 text-left flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
            <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              Network
            </div>
            <div className="text-xl font-mono font-bold text-white mb-1 truncate group-hover:text-amber-300 transition-colors">
              {ip}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mb-4 truncate" title={navigator.userAgent}>
              {navigator.userAgent.split(' ')[0]} ...
            </div>
            <div className="mt-auto">
              <div className="text-[10px] text-slate-500 font-mono tracking-widest">SYSTEM TIME</div>
              <div className="text-xs font-mono text-slate-300 truncate">{time}</div>
            </div>
          </div>

          {/* Geolocation */}
          <div className="bg-[#121824]/80 backdrop-blur-sm border border-[#1e293b] rounded-xl p-0 text-left flex flex-col relative overflow-hidden group min-h-[160px]">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none group-hover:opacity-70 transition-opacity duration-700">
               {location.lat !== 'WAITING...' && location.lat !== 'DENIED' && location.lat !== 'UNSUPPORTED' && (
                 <iframe 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
                   className="w-full h-full object-cover filter contrast-125 saturate-50 pointer-events-none scale-110"
                   title="Satellite Map"
                 />
               )}
            </div>
            <div className="p-5 relative z-10 flex flex-col h-full bg-gradient-to-t from-[#121824] via-[#121824]/60 to-transparent">
              <div className="text-[10px] text-[#00e676] font-mono tracking-widest uppercase mb-4 flex items-center gap-2 drop-shadow-md">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Location
              </div>
              <div className="flex flex-col gap-1 mb-4 mt-auto">
                <div className="text-xl font-bold text-white group-hover:text-[#00e676] transition-colors drop-shadow-md line-clamp-1">{location.city || 'SATELLITE_TRACKING'}</div>
                <div className="text-[10px] font-mono text-emerald-300/80 drop-shadow-md">{location.lat}, {location.lon}</div>
              </div>
            </div>
          </div>

          {/* Power */}
          <div className="bg-[#121824]/80 backdrop-blur-sm border border-[#1e293b] rounded-xl p-5 text-left flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
            <div className="text-[10px] text-amber-400 font-mono tracking-widest uppercase mb-4 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Power Core
            </div>
            <div className="text-4xl font-black text-white mb-2 group-hover:text-amber-400 transition-colors drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              {battery.level}
            </div>
            
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-4 border border-white/5 relative">
               <div 
                  className={`absolute top-0 left-0 h-full ${battery.charging === false && parseInt(battery.level) <= 20 ? 'bg-red-500' : 'bg-amber-400'}`} 
                  style={{ width: battery.level === 'UNSUPPORTED' ? '0%' : battery.level }} 
               />
            </div>

            <div className="mt-auto flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded self-start">
              {battery.charging === true && <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span>}
              {battery.charging === false && <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>}
              {battery.charging === true ? 'CHARGING' : battery.charging === false ? 'DISCHARGING' : 'UNKNOWN'}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Ads System */}
      <AnimatePresence>
        {showAd && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, y: 50, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
            className="fixed bottom-6 right-6 w-80 bg-[#121824]/95 backdrop-blur-md border border-[#1e293b] rounded-xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-40 overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 pointer-events-none ${adIndex === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {ads[adIndex].title}
              </span>
              <button onClick={() => setShowAd(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <p className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed relative z-10 mb-4">
              {ads[adIndex].content}
            </p>

            <div className="relative z-10">
               {ads[adIndex].actionLink ? (
                 <a 
                   href={ads[adIndex].actionLink} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="block w-full text-center bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 py-2 rounded text-xs font-bold tracking-widest transition-colors"
                 >
                   {ads[adIndex].actionText}
                 </a>
               ) : (
                 <button 
                   onClick={() => handleCopy('npm install github:jamesdevoff/AnimeBails')}
                   className="block w-full text-center bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 py-2 rounded text-xs font-bold tracking-widest transition-colors"
                 >
                   {copied ? 'PACK COPIED!' : ads[adIndex].actionText}
                 </button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Socials Floating Button */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-4">
        <button 
          onClick={() => setShowSocials(!showSocials)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white bg-[#0f1420] border-2 border-[#1e293b] shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all z-10 
            ${showSocials ? 'rotate-45 shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-[#1e293b]' : 'hover:scale-110'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>

        <AnimatePresence>
          {showSocials && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col gap-3"
            >
              {/* Telegram */}
              <a 
                href="https://t.me/shenxidev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#26A5E4]/20 border border-[#26A5E4]/50 flex items-center justify-center text-[#26A5E4] hover:bg-[#26A5E4] hover:text-white transition-all shadow-[0_0_15px_rgba(38,165,228,0.3)] hover:scale-110"
                title="Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.2 3.45-.49.34-.93.5-1.33.49-.44-.01-1.28-.24-1.91-.44-.77-.24-1.38-.37-1.33-.78.02-.21.35-.43.96-.65 3.76-1.63 6.27-2.73 7.53-3.25 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.48.14.11.08.15.22.15.34-.01.12-.01.27-.03.41z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a 
                href="https://wa.me/message/YOUR_NUMBER" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:scale-110"
                title="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm5.49 14.18c-.23.64-1.35 1.23-1.88 1.34-.5.1-1.12.18-1.85-.05-.44-.14-1.02-.34-1.77-.66-3.18-1.36-5.25-4.64-5.41-4.85-.16-.21-1.29-1.72-1.29-3.28s.82-2.33 1.11-2.64c.26-.28.58-.35.77-.35.2 0 .4.01.57.01.19.01.44-.07.66.47.23.54.77 1.88.84 2.02.07.14.11.3.02.49-.1.19-.15.3-.3.47-.14.16-.3.35-.43.49-.14.14-.29.29-.13.57.16.28.71 1.18 1.53 1.91 1.06.94 1.93 1.24 2.22 1.38.28.14.45.12.61-.06.16-.18.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.62.77 1.91.91.28.14.47.21.54.34.07.13.07.72-.16 1.36z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a 
                href="https://github.com/jamesdevoff" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#f0f6fc]/10 border border-[#f0f6fc]/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-110"
                title="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
