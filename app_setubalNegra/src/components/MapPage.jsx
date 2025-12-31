import React, { useEffect, useState, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import ResponsiveHeader from './ResponsiveHeader';

const monumentos = [
  {
    id: 1,
    nomeKey: "poi_1_name",
    subKey: "poi_1_sub",
    infoKey: "poi_1_info",
    audioPath: "./assets/ponto_1",
    pos: { lat: 38.52345866090092, lng: -8.889270953156442 },
    horarioKey: "horario_1",
    img: "./assets/alfandega.jpg",
  },
  {
    id: 2,
    nomeKey: "poi_2_name",
    subKey: "poi_2_sub",
    infoKey: "poi_2_info",
    audioPath: "./assets/ponto_2",
    pos: { lat: 38.52460000637646, lng: -8.88756996719753 },
    horarioKey: "horario_2",
    img: "./assets/se_setubal.png",
  },
  {
    id: 3,
    nomeKey: "poi_3_name",
    subKey: "poi_3_sub",
    infoKey: "poi_3_info",
    audioPath: "./assets/ponto_3",
    pos: { lat: 38.524650, lng: -8.887600 },
    horarioKey: "horario_3",
    img: "./assets/corpo_santo.png",
  },
  {
    id: 4,
    nomeKey: "poi_4_name",
    subKey: "poi_4_sub",
    infoKey: "poi_4_info",
    audioPath: "./assets/ponto_4",
    pos: { lat: 38.52596911747808, lng: -8.894628824349434 },
    horarioKey: "horario_4",
    img: "./assets/convento_jesus.png",
  },
  {
    id: 5,
    nomeKey: "poi_5_name",
    subKey: "poi_5_sub",
    infoKey: "poi_5_info",
    audioPath: "./assets/ponto_5",
    pos: { lat: 38.52245170505707, lng: -8.900317382629833 },
    horarioKey: "horario_5",
    img: "./assets/anunciada.png",
  },
  {
    id: 6,
    nomeKey: "poi_6_name",
    subKey: "poi_6_sub",
    infoKey: "poi_6_info",
    audioPath: "./assets/ponto_6",
    pos: { lat: 38.524222912961214, lng: -8.892668681532145 },
    horarioKey: "horario_6",
    img: "./assets/praca_bocage.png",
  },
  {
    id: 7,
    nomeKey: "poi_7_name",
    subKey: "poi_7_sub",
    infoKey: "poi_7_info",
    audioPath: "./assets/ponto_7",
    pos: { lat: 38.523596, lng: -8.891891 },
    horarioKey: "horario_7",
    img: "./assets/ribeira_velha.png",
  },
  {
    id: 8,
    nomeKey: "poi_8_name",
    subKey: "poi_8_sub",
    infoKey: "poi_8_info",
    audioPath: "./assets/ponto_8",
    pos: { lat: 38.5238, lng: -8.8935 },
    horarioKey: "horario_8",
    img: "./assets/banco_portugal.png",
  },
  {
    id: 9,
    nomeKey: "poi_9_name",
    subKey: "poi_9_sub",
    infoKey: "poi_9_info",
    audioPath: "./assets/ponto_9",
    pos: { lat: 38.5241, lng: -8.8890 },
    horarioKey: "horario_9",
    img: "./assets/pelourinho.png",
  }
];

const Directions = ({ userLocation, destination, activeRoute }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#000000", strokeWeight: 5, strokeOpacity: 0.8 }
    });
    setDirectionsRenderer(renderer);
    return () => renderer.setMap(null);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsRenderer || !routesLibrary || !userLocation || !destination || !activeRoute) {
      if (directionsRenderer) directionsRenderer.setDirections({ routes: [] });
      return;
    }
    const directionsService = new routesLibrary.DirectionsService();
    directionsService.route({
      origin: userLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING
    }, (result, status) => {
      if (status === 'OK') directionsRenderer.setDirections(result);
    });
  }, [directionsRenderer, routesLibrary, userLocation, destination, activeRoute]);
  return null;
};

const MapPage = ({ onBack, t, activeLang, handleLangChange }) => {
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [ultimoPontoVisitado, setUltimoPontoVisitado] = useState(monumentos[0]);
  const [userLocation, setUserLocation] = useState({ lat: 38.5244, lng: -8.8926 });
  const [activeRoute, setActiveRoute] = useState(false);
  
  const audioRef = useRef(null);
  const dragY = useMotionValue(0);

  const contentOpacity = useTransform(dragY, [0, -300], [0, 1]);
  const contentScale = useTransform(dragY, [0, -300], [0.95, 1]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsExpanded(false);
    setIsPlaying(false);
    setCurrentTime(0);

    // --- ESTA É A LINHA QUE DEVES ADICIONAR ---
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    // ------------------------------------------

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
    
    if (selectedPoi) {
      setUltimoPontoVisitado(selectedPoi);
    }
  }, [selectedPoi, dragY]);


  const nextPoi = useMemo(() => {
    if (!selectedPoi) return monumentos[0];
    const currentIndex = monumentos.findIndex(m => m.id === selectedPoi.id);
    return monumentos[currentIndex + 1] || null;
  }, [selectedPoi]);

  const toggleAudio = (e) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  const contentRef = useRef(null);
  const [limiteSubida, setLimiteSubida] = useState(-300); // Valor inicial seguro

  useEffect(() => {
    if (selectedPoi && contentRef.current) {
      // Pequeno delay para garantir que o texto traduzido já foi renderizado
      const timer = setTimeout(() => {
        const alturaReal = contentRef.current.scrollHeight;
        // Calculamos o quanto o painel deve subir. 
        // Queremos que ele suba o tamanho do conteúdo, mas não mais que 80% da tela
        const maximoPermitido = window.innerHeight * 0.7;
        const finalHeight = Math.min(alturaReal + 100, maximoPermitido);
        setLimiteSubida(-finalHeight);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedPoi, activeLang]); // Recalcula se mudar o POI ou a língua

    
  useEffect(() => {
    console.log("O limiteSubida mudou para:", limiteSubida);
  }, [limiteSubida]);

  const headerRef = useRef(null);
  const [alturaVisivel, setAlturaVisivel] = useState(150);

  useEffect(() => {
  if (selectedPoi && headerRef.current) {
    const timer = setTimeout(() => {
      const hHeight = headerRef.current.offsetHeight;
      const handleHeight = 40; // Aproximadamente o espaço da barra de arrastar + paddings
      setAlturaVisivel(hHeight + handleHeight + 20); // 20px de margem extra
    }, 150);
    return () => clearTimeout(timer);
  }
  }, [selectedPoi, activeLang]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const sectionsWithKeys = [
    { nameKey: 'visita_guiada', id: 'visita-guiada' },
    { nameKey: 'sobre_nos', id: 'sobre-nos' },
    { nameKey: 'opiniao', id: 'opiniao' },
    { nameKey: 'contactos', id: 'contactos' },
  ];

  return (
    <div className="fixed inset-0 w-full h-full z-[60] bg-[#EBECE6] overflow-hidden flex flex-col font-sans text-black">
      <div className="z-[70]">
        <ResponsiveHeader 
          transparent={true} 
          onNavigate={(id) => onBack()} 
          activeLang={activeLang}
          handleLangChange={handleLangChange}
          sections={sectionsWithKeys}
          t={t}
        />
      </div>

      <div className="absolute inset-0 w-full h-full z-10">
        {apiKey ? (
          <APIProvider apiKey={apiKey} libraries={['routes']}>
            <Map 
              defaultCenter={{ lat: 38.5244, lng: -8.8931 }} 
              defaultZoom={17} 
              mapId={mapId} 
              disableDefaultUI={true}
              className="w-full h-full"
            >
              {monumentos.map((m) => (
                <AdvancedMarker key={m.id} position={m.pos} onClick={() => { setSelectedPoi(m); setActiveRoute(false); }}>
                  <div className="w-10 h-10 bg-white border border-black rounded-full flex items-center justify-center cursor-pointer text-black">
                    {m.id}
                  </div>
                </AdvancedMarker>
              ))}
              {userLocation && (
                <AdvancedMarker position={userLocation}>
                  <div className="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg animate-pulse" />
                </AdvancedMarker>
              )}
              <Directions 
                userLocation={userLocation} 
                destination={selectedPoi ? selectedPoi.pos : ultimoPontoVisitado.pos} 
                activeRoute={activeRoute} 
              />
            </Map>
          </APIProvider>
        ) : (
          <div className="flex items-center justify-center h-full text-black">Erro de API</div>
        )}
      </div>

      {!selectedPoi && (
        <div className="absolute inset-x-0 bottom-10 flex flex-row justify-center items-center space-x-3 px-6 z-[50] pointer-events-none">
          <button 
            onClick={onBack} 
            className="flex-1 max-w-[200px] py-4 bg-white/90 border border-black rounded-full font-bold text-[10px] uppercase tracking-wider text-black shadow-lg pointer-events-auto"
          >
            {t('voltar')}
          </button>

          <button 
            onClick={() => setActiveRoute(!activeRoute)} 
            className={`flex-1 max-w-[200px] py-4 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-2xl transition-all pointer-events-auto ${activeRoute ? 'bg-red-500 text-white' : 'bg-white text-black border border-black'}`}
          >
            {activeRoute ? t('parar') : `${t('ponto')} ${ultimoPontoVisitado.id}`}
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedPoi && (
          <>
            <audio 
              ref={audioRef} 
              src={`${selectedPoi.audioPath}_${activeLang}.mp3`} 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)} 
            />

            
            <motion.div 
              style={{
                y: dragY,
                bottom: `calc(-100vh + ${alturaVisivel}px)`
              }}
              drag="y"
              // Permitimos o drag, mas vamos controlar o conflito dentro da div de conteúdo
              dragConstraints={{ top: limiteSubida, bottom: 0 }}
              dragElastic={0.02}
              onDragEnd={(e, info) => {
                // Lógica de expandir (puxar para cima)
                if (info.offset.y < -100 || info.velocity.y < -300) {
                  setIsExpanded(true);
                  animate(dragY, limiteSubida, { type: 'spring', damping: 25, stiffness: 300 });
                } 
                // Lógica de fechar (puxar para baixo)
                else if (info.offset.y > 100 || info.velocity.y > 300) {
                  setIsExpanded(false);
                  animate(dragY, 0, { type: 'spring', damping: 25, stiffness: 300 });
                }
                
                if (info.offset.y > 150 && !isExpanded) setSelectedPoi(null);
              }}
              className="md:hidden fixed inset-x-0 bottom-[-90vh] h-screen bg-white/40 backdrop-blur-xl rounded-t-[40px] shadow-2xl z-[80] border-t border-white/40 flex flex-col pointer-events-none"
            >
              
              {/* Esta zona (handle) continua a servir para arrastar o painel */}
              <div className="w-full flex justify-center py-5 pointer-events-auto cursor-grab">
                <div className="w-10 h-1 bg-black/10 rounded-full"></div>
              </div>

              <div 
                ref={contentRef} 
                className={`px-8 pb-32 flex-1 pointer-events-auto overscroll-contain ${
                  isExpanded ? 'overflow-y-auto' : 'overflow-hidden'
                }`}
                onPointerDown={(e) => {
                  // Se o scroll não estiver no topo, impedimos que o drag do painel comece
                  // Isso permite que o utilizador faça scroll normalmente
                  if (isExpanded && contentRef.current.scrollTop > 0) {
                    e.stopPropagation();
                  }
                }}
                onScroll={(e) => {
                  // Se o utilizador fizer scroll até ao topo, podemos opcionalmente 
                  // libertar o drag, mas o stopPropagation no onPointerDown costuma bastar.
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
                  <p className="text-[15px] leading-relaxed text-black/80 mb-3">{t(selectedPoi.infoKey)}</p>

                  <div className="w-full px-2 mb-6">
                    <input 
                      type="range" 
                      min="0" 
                      max={duration} 
                      value={currentTime} 
                      onChange={(e) => {
                        const time = Number(e.target.value);
                        audioRef.current.currentTime = time;
                        setCurrentTime(time);
                      }} 
                      className="w-full h-[3px] bg-black/10 rounded-full appearance-none cursor-pointer accent-black" 
                    />
                    <div className="flex justify-between text-[11px] mt-2 font-medium text-black/40">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div className="flex justify-center items-center space-x-10">                
                      <button 
                        onClick={toggleAudio} 
                        className="w-10 h-10 border border-black rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-xl"
                      >
                        {isPlaying ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                            <path d="M5 3l14 9-14 9V3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <img src={selectedPoi.img} className="w-full h-48 object-cover rounded-[30px] shadow-lg mb-4" alt={t(selectedPoi.nomeKey)} />
                  
                  {nextPoi && (
                    <button 
                      onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); }} 
                      className="w-full py-4 bg-white text-black border border-black rounded-full font-bold text-xs shadow-xl mb-4"
                    >
                      {t('seguir_para')} {t('ponto')} {nextPoi.id} 
                    </button>
                  )}
                  <div className="text-black/70 italic text-sm mb-10">{t('horario_label')}: {t(selectedPoi.horarioKey)}</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className="hidden md:block absolute top-32 right-10 w-[400px] bg-white/40 backdrop-blur-md rounded-[32px] p-8 z-[80] shadow-2xl border border-white/20 pointer-events-auto"
            >
              <button onClick={() => setSelectedPoi(null)} className="absolute top-4 right-6 text-2xl opacity-30 hover:opacity-100 transition-opacity">×</button>
              <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-4 inline-block font-bold">{t('ponto')} {selectedPoi.id}</span>
              <h2 className="text-2xl font-bold text-black mb-1">{t(selectedPoi.nomeKey)}</h2>
              <p className="text-xs opacity-60 mb-6 font-medium uppercase tracking-tight">{t(selectedPoi.subKey)}</p>
              
              <div className="w-full px-2 mb-6">
                <input 
                  type="range" 
                  min="0" 
                  max={duration} 
                  value={currentTime} 
                  onChange={(e) => {
                    const time = Number(e.target.value);
                    audioRef.current.currentTime = time;
                    setCurrentTime(time);
                  }} 
                  className="w-full h-[3px] bg-black/10 rounded-full appearance-none cursor-pointer accent-black" 
                />
                <div className="flex justify-between text-[11px] mt-2 font-medium text-black/40">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex justify-center items-center space-x-10">                
                  <button 
                    onClick={toggleAudio} 
                    className="w-10 h-10 border border-black rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-xl"
                  >
                    {isPlaying ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                        <path d="M5 3l14 9-14 9V3z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <img src={selectedPoi.img} className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md" alt={t(selectedPoi.nomeKey)} />
              <p className="text-sm text-black/80 leading-relaxed mb-6">{t(selectedPoi.infoKey)}</p>
              {nextPoi && (
                    <button 
                      onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); }} 
                      className="w-full py-4 bg-white text-black border border-black rounded-full font-bold text-xs shadow-xl mb-4"
                    >
                      {t('seguir_para')} {t('ponto')} {nextPoi.id} 
                    </button>
              )}
              
              <div className="text-black/70 italic text-sm">{t('horario_label')}: {t(selectedPoi.horarioKey)}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPage;