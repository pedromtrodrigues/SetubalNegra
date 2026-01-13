import React, { useEffect, useState, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import ResponsiveHeader from './ResponsiveHeader';
import PoiPanel from './PoiPanel';

const monumentos = [
  { id: 1, nomeKey: "poi_1_name", subKey: "poi_1_sub", infoKey: "poi_1_info", audioPath: "ponto_1", pos: { lat: 38.52345866090092, lng: -8.889270953156442 }, horarioKey: "horario_1", img: "image_1.jpg" },
  { id: 2, nomeKey: "poi_2_name", subKey: "poi_2_sub", infoKey: "poi_2_info", audioPath: "ponto_2", pos: { lat: 38.52460000637646, lng: -8.88756996719753 }, horarioKey: "horario_2", img: "image_2.png" },
  { id: 3, nomeKey: "poi_3_name", subKey: "poi_3_sub", infoKey: "poi_3_info", audioPath: "ponto_3", pos: { lat: 38.524650, lng: -8.887600 }, horarioKey: "horario_3", img: "image_3.png" },
  { id: 4, nomeKey: "poi_4_name", subKey: "poi_4_sub", infoKey: "poi_4_info", audioPath: "ponto_4", pos: { lat: 38.52596911747808, lng: -8.894628824349434 }, horarioKey: "horario_4", img: "image_4.png" },
  { id: 5, nomeKey: "poi_5_name", subKey: "poi_5_sub", infoKey: "poi_5_info", audioPath: "ponto_5", pos: { lat: 38.52245170505707, lng: -8.900317382629833 }, horarioKey: "horario_5", img: "image_5.png" },
  { id: 6, nomeKey: "poi_6_name", subKey: "poi_6_sub", infoKey: "poi_6_info", audioPath: "ponto_6", pos: { lat: 38.524222912961214, lng: -8.892668681532145 }, horarioKey: "horario_6", img: "image_6.png" },
  { id: 7, nomeKey: "poi_7_name", subKey: "poi_7_sub", infoKey: "poi_7_info", audioPath: "ponto_7", pos: { lat: 38.523596, lng: -8.891891 }, horarioKey: "horario_7", img: "image_7.png" },
  { id: 8, nomeKey: "poi_8_name", subKey: "poi_8_sub", infoKey: "poi_8_info", audioPath: "ponto_8", pos: { lat: 38.5238, lng: -8.8935 }, horarioKey: "horario_8", img: "image_8.png" },
  { id: 9, nomeKey: "poi_9_name", subKey: "poi_9_sub", infoKey: "poi_9_info", audioPath: "ponto_9", pos: { lat: 38.5241, lng: -8.8890 }, horarioKey: "horario_9", img: "image_1.jpg" }
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

const MapPage = ({ onBack, t, activeLang, handleLangChange, selectedPoi, setSelectedPoi }) => {
  const [ultimoPontoVisitado, setUltimoPontoVisitado] = useState(monumentos[0]);
  const [userLocation, setUserLocation] = useState({ lat: 38.5244, lng: -8.8926 });
  const [activeRoute, setActiveRoute] = useState(false);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;

  useEffect(() => {
    if (selectedPoi) {
      setUltimoPontoVisitado(selectedPoi);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPoi]);

  const nextPoi = useMemo(() => {
    if (!selectedPoi) return monumentos[0];
    const currentIndex = monumentos.findIndex(m => m.id === selectedPoi.id);
    return monumentos[currentIndex + 1] || null;
  }, [selectedPoi]);

  const sectionsWithKeys = [
    { nameKey: 'visita_guiada', id: 'visita-guiada' },
    { nameKey: 'sobre_nos', id: 'sobre-nos' },
    { nameKey: 'opiniao', id: 'opiniao' },
    { nameKey: 'contactos', id: 'contactos' },
  ];

  return (
    /* AJUSTE: Mudei "overflow-hidden" para "overflow-y-auto" no desktop (md:overflow-y-auto) */
    <div className="fixed inset-0 w-full h-full z-[60] bg-[#EBECE6] overflow-hidden md:overflow-y-auto flex flex-col font-sans text-black">
      
      {/* BLOQUEIO: Overlay que cobre Header (70) e botões (50) quando um POI está aberto */}
      {selectedPoi && (
        <div 
          className="fixed inset-0 z-[100] bg-black/10 cursor-default" 
          onClick={() => setSelectedPoi(null)}
        />
      )}

      <div className="z-[70]">
        <ResponsiveHeader 
          transparent={true} 
          onNavigate={onBack} 
          activeLang={activeLang}
          handleLangChange={handleLangChange}
          sections={sectionsWithKeys}
          t={t}
        />
      </div>

      /* AJUSTE: No desktop, o mapa deve ser "fixed" para não rolar com o conteúdo do painel */
      <div className="absolute md:fixed inset-0 w-full h-full z-10">
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
                <AdvancedMarker
                  key={m.id}
                  position={m.pos}
                  onClick={() => {
                    if (selectedPoi) return; 
                    setSelectedPoi(m);
                  }}
                >
                  <div className="w-10 h-10 bg-white border border-black/40 rounded-full flex items-center justify-center cursor-pointer text-black shadow-md hover:bg-gray-100 transition-colors">
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
            className={`
              flex-1 max-w-[200px] py-4 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-2xl transition-all pointer-events-auto
              ${activeRoute 
                ? 'bg-red-600 text-white border-transparent shadow-red-200' 
                : 'bg-white/90 text-black border border-black shadow-lg'    
              }
            `}
          >
            {activeRoute ? t('parar') : `${t('ponto')} ${ultimoPontoVisitado.id}`}
          </button>
        </div>
      )}

      {/* PoiPanel com o maior z-index para ficar acima do bloqueio */}
      <div className="relative z-[110]">
        <PoiPanel 
          selectedPoi={selectedPoi}
          setSelectedPoi={setSelectedPoi}
          nextPoi={nextPoi}
          setActiveRoute={setActiveRoute}
          activeLang={activeLang}
          t={t}
        />
      </div>
    </div>
  );
};

export default MapPage;