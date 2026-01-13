import React, { useRef, useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';

const AUDIO_BASE_PATH = "./assets/Audios";
const IMG_BASE_PATH = "./assets/images";

const PoiPanel = ({ selectedPoi, setSelectedPoi, nextPoi, setActiveRoute, activeLang, t }) => {
  const audioRef = useRef(null);
  const sheetRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [snapIndex, setSnapIndex] = useState(1);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [selectedPoi]);

  const toggleAudio = (e) => {
    if (e) e.stopPropagation();
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  if (!selectedPoi) return null;

  const handleNextPoiNavigation = () => {
    setSelectedPoi(nextPoi); 
    setActiveRoute(true);
    if (!isDesktop && sheetRef.current) {
      sheetRef.current.snapTo(1);
    }
  };

  // --- VERSÃO DESKTOP (Bloco novo para scroll na página) ---
  if (isDesktop) {
    return (
      <div 
        className="w-full bg-white/40 backdrop-blur-xl border-t border-white/40 px-8 md:px-16 py-20 relative z-[110] md:-mt-32 rounded-t-[50px]"
      >
        <audio 
          ref={audioRef} 
          src={`${AUDIO_BASE_PATH}/${selectedPoi.audioPath}_${activeLang}.mp3`} 
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onEnded={() => setIsPlaying(false)} 
        />
        <div className="max-w-7xl mx-auto">
           {/* HEADER (Título e Player) */}
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full mb-10">
                <div className="md:flex-1">
                  <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-2 inline-block font-bold uppercase tracking-wider">
                    {t('ponto')} {selectedPoi.id}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-black leading-tight">{t(selectedPoi.nomeKey)}</h2>
                  <p className="text-[13px] opacity-40 text-black font-medium">{t(selectedPoi.subKey)}</p>
                </div>
                
                <div className="w-full md:w-[50%] flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="range" min="0" max={duration} value={currentTime} 
                      onChange={(e) => { audioRef.current.currentTime = Number(e.target.value); }} 
                      className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-black"
                      style={{ background: `linear-gradient(to right, #000000 ${progressPercent}%, rgba(0,0,0,0.1) ${progressPercent}%)` }}
                    />
                    <div className="flex justify-between text-[11px] mt-1 font-medium text-black/40">
                      <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center space-x-10">                
                    <button onClick={toggleAudio} className="w-10 h-10 border border-black rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-xl bg-white/20 backdrop-blur-sm">
                      {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* CONTEÚDO (Imagem e Texto) */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                <img src={`${IMG_BASE_PATH}/${selectedPoi.img}`} className="w-full md:w-1/2 h-48 md:h-[60vh] object-cover rounded-[30px] shadow-lg" alt="" /> 
                <div className="w-full md:flex-1 flex flex-col">
                  <div className="md:order-2 md:mt-20 text-black/90 italic text-sm mb-4">{t('horario_label')}: {t(selectedPoi.horarioKey)}</div>
                  <p className="md:order-1 text-[15px] leading-relaxed text-black/80 mb-8 whitespace-pre-line">{t(selectedPoi.infoKey)}</p>
                  {nextPoi && (
                    <button onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="md:order-3 md:mt-20 w-full py-4 bg-white text-black border border-black rounded-full font-bold text-xs shadow-xl mb-4">
                      {t('seguir_para')} {t('ponto')} {nextPoi.id} 
                    </button>
                  )}
                </div>
              </div>
        </div>
      </div>
    );
  }

  // --- VERSÃO MOBILE (EXATAMENTE O TEU ORIGINAL) ---
  return (
    <>
      <audio 
        ref={audioRef} 
        src={`${AUDIO_BASE_PATH}/${selectedPoi.audioPath}_${activeLang}.mp3`} 
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)} 
      />

      <Sheet 
        ref={sheetRef}
        isOpen={!!selectedPoi} 
        onClose={() => setSelectedPoi(null)}
        snapPoints={[0.85, 0.15, 0]}
        initialSnap={1}
        onSnap={(index) => setSnapIndex(index)}
      >
        <Sheet.Container className="md:px-8 !bg-white/40 !backdrop-blur-xl !rounded-t-[40px] !border-t !border-white/40 shadow-2xl md:max-w-full md:mx-auto">
          <Sheet.Header>
            <div className="w-full flex justify-center py-5">
              <div className="w-10 h-1 bg-black/10 rounded-full"></div>
            </div>
          </Sheet.Header>
          
          <Sheet.Content>
            <Sheet.Scroller 
              draggable={snapIndex === 0}
              className={`px-8 pb-32 [&::-webkit-scrollbar]:hidden ${snapIndex !== 0 ? 'overflow-hidden' : 'overflow-y-auto'}`}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
                touchAction: snapIndex === 0 ? 'auto' : 'none' 
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full mb-10">
                <div className="md:flex-1">
                  <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-2 inline-block font-bold uppercase tracking-wider">
                    {t('ponto')} {selectedPoi.id}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-black leading-tight">{t(selectedPoi.nomeKey)}</h2>
                  <p className="text-[13px] opacity-40 text-black font-medium">{t(selectedPoi.subKey)}</p>
                </div>
                
                <div className="w-full md:w-[50%] flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="range" min="0" max={duration} value={currentTime} 
                      onChange={(e) => { audioRef.current.currentTime = Number(e.target.value); }} 
                      className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-black"
                      style={{ background: `linear-gradient(to right, #000000 ${progressPercent}%, rgba(0,0,0,0.1) ${progressPercent}%)` }}
                    />
                    <div className="flex justify-between text-[11px] mt-1 font-medium text-black/40">
                      <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center space-x-10">                
                    <button 
                      onClick={toggleAudio} 
                      className="w-10 h-10 border border-black rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-xl"
                    >
                      {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                <img 
                  src={`${IMG_BASE_PATH}/${selectedPoi.img}`} 
                  className="w-full md:w-1/2 h-48 md:h-[60vh] object-cover rounded-[30px] shadow-lg" 
                  alt="" 
                /> 
                <div className="w-full md:flex-1 flex flex-col">
                  <div className="md:order-2 md:mt-20 text-black/90 italic text-sm mb-4">{t('horario_label')}: {t(selectedPoi.horarioKey)}</div>
                  <p className="md:order-1 text-[15px] leading-relaxed text-black/80 mb-8 whitespace-pre-line">{t(selectedPoi.infoKey)}</p>
                  {nextPoi && (
                    <button 
                      onClick={handleNextPoiNavigation}
                      className="md:order-3 md:mt-20 w-full py-4 bg-white text-black border border-black rounded-full font-bold text-xs shadow-xl mb-4"
                    >
                      {t('seguir_para')} {t('ponto')} {nextPoi.id} 
                    </button>
                  )}
                </div>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default PoiPanel;