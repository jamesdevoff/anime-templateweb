import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const projectList = [
  { id: 1, name: 'Anime MD', category: 'WhatsApp Bot', desc: 'A multi-device WhatsApp bot tailored for anime fetching and group management. Fast, reliable, and uses the AnimeBails library.', color: 'text-pink-400', bg: 'bg-pink-500/10', link: 'https://github.com/jamesdevoff/AnimeBails' },
  { id: 2, name: 'VPS Scripts', category: 'Infrastructure', desc: 'High performance root access VPS deployment snippets and automated setup scripts.', color: 'text-blue-400', bg: 'bg-blue-500/10', link: 'https://github.com/jamesdevoff' },
  { id: 3, name: 'Pterodactyl UI', category: 'Hosting', desc: 'Custom configured Pterodactyl node themes and panel game server management tools.', color: 'text-indigo-400', bg: 'bg-indigo-500/10', link: 'https://github.com/jamesdevoff' },
  { id: 4, name: 'Neural API', category: 'Backend Interface', desc: 'Fast and reliable API endpoint generation for AI bot tasks and neural processing.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: 'https://github.com/jamesdevoff' },
  { id: 5, name: 'Quantum Core', category: 'System Architecture', desc: 'Core architecture files for clustered server environments.', color: 'text-amber-400', bg: 'bg-amber-500/10', link: 'https://github.com/jamesdevoff' },
];

export function Projects({ onBack }: { onBack: () => void }) {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <motion.div 
      className="w-full max-w-5xl flex flex-col items-center gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full flex justify-between items-center bg-[#121824]/80 backdrop-blur-sm border border-[#1e293b] rounded-xl p-4 px-6 relative overflow-hidden shadow-xl">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
         <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 tracking-tighter">
           <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
           PROJECT LIBRARY
         </h2>
         <button 
           onClick={onBack}
           className="relative z-10 text-xs font-mono font-bold tracking-widest text-[#00e676] hover:text-white bg-[#00e676]/10 hover:bg-[#00e676]/20 border border-[#00e676]/30 rounded-full px-6 py-2 transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)] hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]"
         >
           RETURN
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {projectList.map((project, i) => (
          <motion.button 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`flex flex-col items-start gap-4 ${project.bg} backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all text-left group relative overflow-hidden`}
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
            
            <div className="flex justify-between items-start w-full">
              <span className={`text-2xl font-black ${project.color} group-hover:scale-105 transition-transform origin-left`}>
                {project.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-colors border border-white/5 shadow-inner">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </div>
            
            <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest bg-black/40 border border-white/10 px-3 py-1 rounded-full shadow-inner relative z-10">
              {project.category}
            </span>
            <p className="text-sm text-slate-300 mt-2 line-clamp-3 font-medium leading-relaxed group-hover:text-white transition-colors relative z-10">
              {project.desc}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0f1420] border border-[#1e293b] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
            >
              <div className={`p-8 ${selectedProject.bg} border-b border-white/5 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
                <h3 className={`text-3xl font-black tracking-tighter ${selectedProject.color} mb-2 drop-shadow-lg relative z-10`}>
                  {selectedProject.name}
                </h3>
                <div className="text-xs font-mono text-slate-200 tracking-widest uppercase border border-white/20 rounded-full px-3 py-1 inline-block bg-black/40 shadow-inner relative z-10">
                  {selectedProject.category}
                </div>
              </div>
              <div className="p-8">
                <p className="text-base text-slate-300 leading-relaxed font-sans mb-8">
                  {selectedProject.desc}
                </p>
                <div className="flex gap-4">
                  <a 
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 text-center block ${selectedProject.bg} hover:brightness-125 border border-white/10 text-white py-3 rounded-xl text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                  >
                    GET ACCESS
                  </a>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white py-3 rounded-xl text-sm font-bold tracking-widest transition-all"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
