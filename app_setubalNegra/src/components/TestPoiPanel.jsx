import React, { useRef, useEffect, useState } from 'react';
import { motion, animate, useTransform } from 'framer-motion';

const AUDIO_BASE_PATH = "./assets/Audios";
const IMG_BASE_PATH = "./assets/images";

const PoiPanel = ({ 
  selectedPoi, 
  setSelectedPoi, 
  nextPoi, 
  setActiveRoute, 
  activeLang, 
  t, 
  dragY 
}) => {
  const audioRef = useRef(null);
  const contentRef = useRef(null);
  const headerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [limiteSubida, setLimiteSubida] = useState(-300);
  const [alturaVisivel, setAlturaVisivel] = useState(150);

  // Animações baseadas no movimento do drag
  const contentOpacity = useTransform(dragY, [0, -300], [0, 1]);
  const contentScale = useTransform(dragY, [0, -300], [0.95, 1]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Reset do painel e áudio quando muda o POI
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
    if (selectedPoi) {
      dragY.set(0);
      setIsExpanded(false);
    }
  }, [selectedPoi, dragY]);

  // Cálculo dinâmico da altura do conteúdo para o drag
  useEffect(() => {
    if (selectedPoi && contentRef.current) {
      const timer = setTimeout(() => {
        const alturaReal = contentRef.current.scrollHeight;
        const maximoPermitido = window.innerHeight * 0.7;
        setLimiteSubida(-Math.min(alturaReal + 100, maximoPermitido));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedPoi, activeLang]);

  // Cálculo da altura do cabeçalho visível
  useEffect(() => {
    if (selectedPoi && headerRef.current) {
      const timer = setTimeout(() => {
        const hHeight = headerRef.current.offsetHeight;
        setAlturaVisivel(hHeight + 60); // Header + handle + padding
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedPoi, activeLang]);

  const toggleAudio = (e) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={`${AUDIO_BASE_PATH}/${selectedPoi.audioPath}_${activeLang}.mp3`} 
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)} 
      />

      {/* MOBILE PANEL */}
      <motion.div 
        style={{ y: dragY, bottom: `calc(-100vh + ${alturaVisivel}px)` }}
        drag="y"
        dragConstraints={{ top: limiteSubida, bottom: 0 }}
        dragElastic={0.02}
        onDragEnd={(e, info) => {
          if (info.offset.y < -100 || info.velocity.y < -300) {
            setIsExpanded(true);
            animate(dragY, limiteSubida, { type: 'spring', damping: 25, stiffness: 300 });
          } else if (info.offset.y > 100 || info.velocity.y > 300) {
            animate(dragY, 0, { 
              type: 'spring', damping: 25, stiffness: 300,
              onComplete: () => {
                setIsExpanded(false);
                if (contentRef.current) contentRef.current.scrollTop = 0;
              }
            });
          }
        }}
        className="md:hidden fixed inset-x-0 bottom-[-90vh] h-screen bg-white/40 backdrop-blur-xl rounded-t-[40px] shadow-2xl z-[80] border-t border-white/40 flex flex-col pointer-events-none"
      >
        <div className="w-full flex justify-center py-5 pointer-events-auto cursor-grab">
          <div className="w-10 h-1 bg-black/10 rounded-full"></div>
        </div>

        <div 
          ref={contentRef} 
          className={`px-8 pb-32 flex-1 pointer-events-auto overscroll-contain ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}
          onPointerDown={(e) => {
            if (isExpanded && contentRef.current.scrollTop > 0) e.stopPropagation();
          }}
        >
          <div ref={headerRef} className="mb-2">
            <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-2 inline-block font-bold">{t('ponto')} {selectedPoi.id}</span>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-black leading-tight flex-1">{t(selectedPoi.nomeKey)}</h2>
              <button onClick={() => setSelectedPoi(null)} className="ml-4 opacity-20 text-2xl font-bold">×</button>
            </div>
            <p className="text-[13px] opacity-40 text-black font-medium">{t(selectedPoi.subKey)}</p>
          </div>

          <motion.div style={{ opacity: contentOpacity, scale: contentScale }} className="mt-8">
            <div className="w-full px-2 mb-6">
              <input 
                type="range" min="0" max={duration} value={currentTime} 
                onChange={(e) => { audioRef.current.currentTime = Number(e.target.value); }} 
                className="w-full h-[3px] bg-black/10 rounded-full appearance-none cursor-pointer accent-black" 
              />
              <div className="flex justify-between text-[11px] mt-2 font-medium text-black/40">
                <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
              </div>
              <div className="flex justify-center items-center mt-4">                
                <button onClick={toggleAudio} className="w-12 h-12 border border-black rounded-full flex items-center justify-center text-black shadow-xl">
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <img src={`${IMG_BASE_PATH}/${selectedPoi.img}`} className="w-full h-48 object-cover rounded-[30px] shadow-lg mb-4" alt="" />
            <div className="text-black/90 italic text-sm mb-4">{t('horario_label')}: {t(selectedPoi.horarioKey)}</div>
            <p className="text-[15px] leading-relaxed text-black/80 mb-6">{t(selectedPoi.infoKey)}</p>
            
            {nextPoi && (
              <button 
                onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); }} 
                className="w-full py-4 bg-white text-black border border-black rounded-full font-bold text-xs shadow-xl mb-4"
              >
                {t('seguir_para')} {t('ponto')} {nextPoi.id} 
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* DESKTOP PANEL */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
        className="hidden md:block absolute top-32 right-10 w-[400px] bg-white/40 backdrop-blur-md rounded-[32px] p-8 z-[80] shadow-2xl border border-white/20 pointer-events-auto"
      >
        <button onClick={() => setSelectedPoi(null)} className="absolute top-4 right-6 text-2xl opacity-30 hover:opacity-100 transition-opacity">×</button>
        <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-4 inline-block font-bold">{t('ponto')} {selectedPoi.id}</span>
        <h2 className="text-2xl font-bold text-black mb-1">{t(selectedPoi.nomeKey)}</h2>
        <p className="text-xs opacity-60 mb-6 font-medium uppercase">{t(selectedPoi.subKey)}</p>
        
        <div className="w-full px-2 mb-6">
          <input 
            type="range" min="0" max={duration} value={currentTime} 
            onChange={(e) => { audioRef.current.currentTime = Number(e.target.value); }} 
            className="w-full h-[3px] bg-black/10 rounded-full appearance-none accent-black" 
          />
          <div className="flex justify-between text-[11px] mt-2 text-black/40">
            <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
          </div>
          <button onClick={toggleAudio} className="mx-auto mt-4 w-10 h-10 border border-black rounded-full flex items-center justify-center">
            {isPlaying ? "II" : "▶"}
          </button>
        </div>

        <img src={`${IMG_BASE_PATH}/${selectedPoi.img}`} className="w-full h-40 object-cover rounded-2xl mb-4" alt="" />
        <p className="text-sm text-black/80 mb-6">{t(selectedPoi.infoKey)}</p>
        {nextPoi && (
          <button onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); }} className="w-full py-3 bg-white border border-black rounded-full font-bold text-xs">
            {t('seguir_para')} {t('ponto')} {nextPoi.id} 
          </button>
        )}
      </motion.div>
    </>
  );
};

export default PoiPanel;