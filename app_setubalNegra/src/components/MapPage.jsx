import React, { useEffect, useState, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import ResponsiveHeader from './ResponsiveHeader';

const monumentos = [
  {
    id: 1,
    nome: "Casa da Alfândega",
    subtitulo: "Biblioteca Municipal",
    audioUrl: "/assets/ponto_1_final.mp3",
    pos: { lat: 38.52345866090092, lng: -8.889270953156442 },
    horario: "Seg-Sex: 09:00-19:00 | Sáb: 14:00-19:00 | Dom: 08:30-12:00",
    img: "/assets/alfandega.jpg",
    info: "Setúbal e o tráfico Transatlântico de pessoas escravizadas."
  },
  {
    id: 2,
    nome: "Igreja de Santa Maria da Graça",
    subtitulo: "Sé de Setúbal",
    audioUrl: "/assets/ponto_2_final.mp3",
    pos: { lat: 38.52460000637646, lng: -8.88756996719753 },
    horario: "Ter, Qui, Sex: 20:00-22:30 | Qua: 03:00-17:00 | Dom: 10:00-22:00",
    img: "/assets/se_setubal.png",
    info: "Marco religioso central na história da cidade."
  },
  {
    id: 3,
    nome: "Casa do Corpo Santo",
    subtitulo: "Museu do Barroco",
    audioUrl: "/assets/ponto_3_final.mp3",
    pos: { lat: 38.524650, lng: -8.887600 },
    horario: "Ter-Sex: 09:00-12:30 e 14:00-17:30 | Sáb: 14:00-18:00",
    img: "/assets/corpo_santo.png",
    info: "Antiga sede da confraria dos navegadores e mareantes."
  },
  {
    id: 4,
    nome: "Convento de Jesus",
    subtitulo: "Museu de Setúbal",
    audioUrl: "/assets/ponto_4_final.mp3",
    pos: { lat: 38.52596911747808, lng: -8.894628824349434 },
    horario: "Ter-Sáb: 09:00-12:30 e 14:00-18:00",
    img: "/assets/convento_jesus.png",
    info: "Exemplo maior do estilo manuelino em Setúbal."
  },
  {
    id: 5,
    nome: "Igreja da Anunciada",
    subtitulo: "Busto de São Benedito",
    audioUrl: "/assets/ponto_5_final.mp3",
    pos: { lat: 38.52245170505707, lng: -8.900317382629833 },
    horario: "Horário sob consulta local",
    img: "/assets/anunciada.png",
    info: "Ligação profunda à comunidade piscatória e devoção negra."
  },
  {
    id: 6,
    nome: "Praça de Bocage",
    subtitulo: "Antigo Largo das Couves",
    audioUrl: "/assets/ponto_6_final.mp3",
    pos: { lat: 38.524222912961214, lng: -8.892668681532145 },
    horario: "Espaço Público (Aberto 24h)",
    img: "/assets/praca_bocage.png",
    info: "O coração político e social da vila de Setúbal."
  },
  {
    id: 7,
    nome: "Largo da Ribeira Velha",
    subtitulo: "Antigo Pelourinho",
    audioUrl: "/assets/ponto_7_final.mp3",
    pos: { lat: 38.523596, lng: -8.891891 },
    horario: "Espaço Público (Aberto 24h)",
    img: "/assets/ribeira_velha.png",
    info: "Centro do comércio marítimo e local de justiça."
  },
  {
    id: 8,
    nome: "Galeria do Banco de Portugal",
    subtitulo: "Espaço Cultural",
    audioUrl: "/assets/ponto_8_final.mp3",
    pos: { lat: 38.5238, lng: -8.8935 },
    horario: "Ter-Sáb: 11:00-14:00 e 15:00-18:00 | Dom: 14:00-18:00",
    img: "/assets/banco_portugal.png",
    info: "Edifício histórico recuperado para fins artísticos."
  },
  {
    id: 9,
    nome: "Pelourinho de Setúbal",
    subtitulo: "Praça Marquês de Pombal",
    audioUrl: "/assets/ponto_9_final.mp3",
    pos: { lat: 38.5241, lng: -8.8890 },
    horario: "Espaço Público",
    img: "/assets/pelourinho.png",
    info: "Símbolo da autoridade municipal."
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

  // LOGICA ACRESCENTADA: Lembrar o último ponto visitado para a navegação não resetar
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
    dragY.set(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
    
    // Atualiza o último visitado quando selecionas um novo monumento
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
  };

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
                  <div className="w-10 h-10 bg-white border border-black rounded-full flex items-center justify-center shadow-xl cursor-pointer text-black font-bold">
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
                // LOGICA ACRESCENTADA: Usa o último visitado como destino se nenhum estiver aberto
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
            onClick={() => setActiveRoute(!activeRoute)} 
            className={`flex-1 max-w-[200px] py-4 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-2xl transition-all pointer-events-auto ${activeRoute ? 'bg-red-500 text-white' : 'bg-white text-black border border-black'}`}
          >
            {/* LOGICA ACRESCENTADA: O ID agora é dinâmico conforme o progresso */}
            {activeRoute ? " PARAR" : ` PONTO ${ultimoPontoVisitado.id}`}
          </button>
          <button 
            onClick={onBack} 
            className="flex-1 max-w-[200px] py-4 bg-white/90 border border-black rounded-full font-bold text-[10px] uppercase tracking-wider text-black shadow-lg pointer-events-auto"
          >
            VOLTAR
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedPoi && (
          <>
            <audio 
              ref={audioRef} 
              src={selectedPoi.audioUrl} 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)} 
            />

            <motion.div 
              style={{ y: dragY }} 
              drag="y"
              dragConstraints={{ top: -window.innerHeight + 180, bottom: 0 }}
              dragElastic={0.05}
              onDragEnd={(e, info) => {
                if (info.offset.y < -150 || info.velocity.y < -300) {
                  setIsExpanded(true);
                  animate(dragY, -window.innerHeight + 180, { type: 'spring', damping: 25, stiffness: 300 });
                } else {
                  setIsExpanded(false);
                  animate(dragY, 0, { type: 'spring', damping: 25, stiffness: 300 });
                }
                if (info.offset.y > 150 && !isExpanded) setSelectedPoi(null);
              }}
              initial={{ y: "100%" }}
              animate={{ y: isExpanded ? -window.innerHeight + 180 : 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-x-0 bottom-[-550px] h-full bg-white/40 backdrop-blur-xl rounded-t-[40px] shadow-2xl z-[80] border-t border-white/40 flex flex-col touch-none overflow-hidden pointer-events-none"
            >
              <div className="w-full flex justify-center py-5 pointer-events-auto">
                <div className="w-10 h-1 bg-black/10 rounded-full"></div>
              </div>

              <div className="px-8 pb-32 flex-1 pointer-events-auto overflow-hidden">
                <div className="mb-2">
                  <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-2 inline-block font-bold">Ponto {selectedPoi.id}</span>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-black leading-tight flex-1">{selectedPoi.nome}</h2>
                    <button onClick={() => setSelectedPoi(null)} className="ml-4 opacity-20 text-2xl font-bold">×</button>
                  </div>
                  <p className="text-[13px] opacity-40 text-black font-medium">{selectedPoi.subtitulo}</p>
                </div>

                <motion.div style={{ opacity: contentOpacity, scale: contentScale }} className="mt-8">
                  <p className="text-[15px] leading-relaxed text-black/80 mb-3">{selectedPoi.info}</p>

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

                  <img src={selectedPoi.img} className="w-full h-48 object-cover rounded-[30px] shadow-lg mb-4" alt={selectedPoi.nome} />
                  
                  {nextPoi && (
                    <button 
                      onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); }} 
                      className="w-full py-4 bg-white text-black border border-black rounded-full font-bold text-xs shadow-xl mb-4"
                    >
                      SEGUIR PARA PONTO {nextPoi.id} 
                    </button>
                  )}
                  <div className="text-black/70 italic text-sm">Horário: {selectedPoi.horario}</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className="hidden md:block absolute top-32 right-10 w-[400px] bg-white/40 backdrop-blur-md rounded-[32px] p-8 z-[80] shadow-2xl border border-white/20 pointer-events-auto"
            >
              <button onClick={() => setSelectedPoi(null)} className="absolute top-4 right-6 text-2xl opacity-30 hover:opacity-100 transition-opacity">×</button>
              <span className="border border-black text-[9px] px-2 py-0.5 rounded-full mb-4 inline-block font-bold">Ponto {selectedPoi.id}</span>
              <h2 className="text-2xl font-bold text-black mb-1">{selectedPoi.nome}</h2>
              <p className="text-xs opacity-60 mb-6 font-medium uppercase tracking-tight">{selectedPoi.subtitulo}</p>
              
              <div className="flex flex-col items-center w-full mb-8">
                <input type="range" min="0" max={duration} value={currentTime} onChange={(e) => { audioRef.current.currentTime = e.target.value; setCurrentTime(e.target.value); }} className="w-full h-[3px] bg-black/10 rounded-full appearance-none cursor-pointer accent-black mb-4" />
                <button onClick={toggleAudio} className="w-14 h-14 border border-black rounded-full flex items-center justify-center bg-white shadow-xl hover:scale-110 transition-transform">
                  {isPlaying ? "⏸" : "▶"}
                </button>
              </div>

              <img src={selectedPoi.img} className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md" alt={selectedPoi.nome} />
              <p className="text-sm text-black/80 leading-relaxed mb-6">{selectedPoi.info}</p>
              {nextPoi && (
                <button onClick={() => { setSelectedPoi(nextPoi); setActiveRoute(true); }} className="w-full py-3 bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg">
                  Próximo: Ponto {nextPoi.id} ➔
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPage;