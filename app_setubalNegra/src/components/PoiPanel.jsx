import React, { useRef, useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';

const AUDIO_BASE_PATH = "./assets/Audios";
const IMG_BASE_PATH = "./assets/images";

const PoiPanel = ({ 
  selectedPoi, 
  setSelectedPoi, 
  nextPoi, 
  setActiveRoute, 
  activeLang, 
  t 
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const sheetRef = useRef(null);
  const expandirPainel = () => {
    // O índice 0 é o ponto de 85% (0.85)
    sheetRef.current?.snapTo(0);
  };
    
  // Estado para detetar se é desktop para mudar os snapPoints
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Listener para redimensionamento da janela
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
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!selectedPoi) return null;

  const getSnapEspreitar = () => {
    if (selectedPoi?.id === 7) {
      return isDesktop ? 0.18 : 0.23; // Por exemplo, abre mais alto (40%)
    }
    if (selectedPoi?.id === 1) {
      return isDesktop ? 0.15 : 0.17; // Por exemplo, abre mais alto (40%)
    }
    if (selectedPoi?.id === 2) {
      return isDesktop ? 0.15 : 0.17; // Por exemplo, abre mais alto (40%)
    }
    
    // Valores padrão para todos os outros POIs
    return isDesktop ? 0.15 : 0.15;
  };


// 2. Montar os SnapPoints dinâmicos
  const snapAberto = isDesktop ? 0.9 : 0.85;
  const snapEspreitar = getSnapEspreitar();
  
  const dynamicSnapPoints = [snapAberto, snapEspreitar, 0];


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
        snapPoints={dynamicSnapPoints} // Usa a variável dinâmica
        initialSnap={1} // Usa o índice dinâmico
      >
        {/* Adicionei classes md: para limitar a largura e centrar no Desktop */}
        <Sheet.Container className="!bg-white/40 !backdrop-blur-xl !rounded-t-[40px] !border-t !border-white/40 shadow-2xl md:max-w-full md:mx-auto">
          <Sheet.Header>
            <div className="w-full flex justify-center py-5">
              <div className="w-10 h-1 bg-black/10 rounded-full"></div>
            </div>
          </Sheet.Header>
          
          <Sheet.Content>
            <Sheet.Scroller 
            style={{ 
              msOverflowStyle: 'none', 
              scrollbarWidth: 'none',
            }}
            className="[&::-webkit-scrollbar]:hidden px-8 pb-32" >
              {/* Header do POI */}                
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full">

                {/* 1. BLOCO DE TEXTO (Esquerda) */}
                {/* md:flex-1 faz com que ele ocupe o espaço necessário à esquerda */}
                <div className="md:order-1 md:flex-1">
                  <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-2 inline-block font-bold">
                    {t('ponto')} {selectedPoi.id}
                  </span>
                  <h2 className="text-xl font-bold text-black leading-tight">{t(selectedPoi.nomeKey)}</h2>
                  <p className="text-[13px] opacity-40 text-black font-medium">{t(selectedPoi.subKey)}</p>
                </div>
                  
                {/* 2. BLOCO DO PLAYER (Centro) */}
                {/* md:w-[50%] para dar destaque ao player no meio e md:order-2 */}
                <div className="w-full md:w-[50%] md:order-2">
                  {/* md:flex-row e items-center aqui dentro alinham a barra com o botão */}
                  <div className="w-full px-2 flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* Container da Barra e Tempos */}
                    <div className="flex-1">
                      <input 
                        type="range" 
                        min="0" 
                        max={duration} 
                        value={currentTime} 
                        onChange={(e) => { audioRef.current.currentTime = Number(e.target.value); }} 
                        className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-black"
                        style={{
                          // O gradiente cria a cor escura à esquerda e a clara à direita
                          background: `linear-gradient(to right, #000000 ${progressPercent}%, rgba(0,0,0,0.1) ${progressPercent}%)`
                        }}
                      />
                      <div className="flex justify-between text-[11px] mt-1 font-medium text-black/40">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Botão Play - md:mt-0 remove a descida do botão no desktop */}
                    <div className="flex justify-center items-center mt-4 md:mt-0 shrink-0"> 
                      <button onClick={toggleAudio} className="w-12 h-12 border border-black rounded-full flex items-center justify-center text-black shadow-xl">
                        {isPlaying ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGEM: Fora do flex acima para não entrar na conta da ordem horizontal */}
              <img 
                src={`${IMG_BASE_PATH}/${selectedPoi.img}`} 
                className="w-full h-48 md:h-64 object-cover rounded-[30px] shadow-lg mt-[55px]" 
                alt="" 
              /> 
              {/* Lado Direito: Texto e Botões */}
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="text-black/90 italic text-sm mb-4">{t('horario_label')}: {t(selectedPoi.horarioKey)}</div>
                <p className="text-[15px] leading-relaxed text-black/80 mb-6">
                  {t(selectedPoi.infoKey)}
                </p>
                
                {nextPoi && (
                  <button 
                    onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); }} 
                    className="w-full py-4 bg-white text-black border border-black rounded-full font-bold text-xs shadow-xl mb-4 mt-auto"
                  >
                    {t('seguir_para')} {t('ponto')} {nextPoi.id} 
                  </button>
                )}
              </div>

            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default PoiPanel;