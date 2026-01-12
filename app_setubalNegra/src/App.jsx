// App.jsx (Versão com Animações Framer Motion)
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importação das animações
import 'swiper/css';
import 'swiper/css/navigation';

import { useTranslation } from './Translation'; 
import { scrollToSection } from './utils/ScrollUtils'; 
import { cardData } from './data/CardData'; 

import ResponsiveHeader from './components/ResponsiveHeader';
import Section from './components/Section';
import ResourceCarousel from './components/ResourceCarousel';
import OpinionForm from './components/OpinionForm';
import Footer from './components/Footer';
import MapPage from './components/MapPage';
import LoadingScreen from './components/LoadingScreen'; 

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

const BACKGROUND_COLOR = 'bg-[#EBECE6]'; 

const sectionsWithKeys = [
  { nameKey: 'visita_guiada', id: 'visita-guiada'},
  { nameKey: 'sobre_nos', id: 'sobre-nos'},
  { nameKey: 'contactos', id: 'contactos'},
];

// Variantes de animação para reutilizar
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const App = () => {
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [activeLang, setActiveLang] = useState('PT'); 
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslation(activeLang); 
  
  const handleLangChange = useCallback((lang) => {
      setActiveLang(lang);
  }, []);

  const handleNavigation = useCallback((id) => {
    scrollToSection(id);
  }, []);

  // FUNÇÃO MESTRE: Faz a ponte entre o site e o mapa com um loading no meio
  const handleStartVisit = () => {
    setIsLoading(true); // Ativa o ecrã de loading
    window.scrollTo(0, 0);

    // Simula o tempo de carregamento (2.5 segundos)
    setTimeout(() => {
      setIsLoading(false); // Esconde o loading
      setShowMap(true);    // Mostra o mapa
    }, 2500);
  };
    
  return (
    <div className={`min-h-screen font-sans ${BACKGROUND_COLOR}`} id="top">
      
      {/* 1. Transição Suave para o Mapa */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* 1. ECRA DE CARREGAMENTO */
          <LoadingScreen key="loading" t={t}/>
        ) : showMap ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <MapPage 
              onBack={() => setShowMap(false)} 
              t={t} 
              activeLang={activeLang} 
              selectedPoi={selectedPoi}
              setSelectedPoi={setSelectedPoi}
              handleLangChange={handleLangChange} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResponsiveHeader
              onNavigate={handleNavigation} 
              activeLang={activeLang}
              handleLangChange={handleLangChange}
              sections={sectionsWithKeys}
              t={t} 
            /> 

            <main>
              {/* SECÇÃO INICIAL */}
              <Section 
                id="hero" 
                className="min-h-screen flex flex-col items-center justify-center bg-[#E9E8E3] px-4"
              > 
                
                <div className="w-full max-w-4xl mx-auto text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center" // Garante que os filhos (img e botão) alinham ao centro
                  >
                    <img 
                      src="./assets/images/Principal.png" 
                      alt="Pintura Setúbal Negra" 
                      className="w-full h-auto object-cover rounded-md mb-8" // mb-8 dá espaço para o botão
                    />
                    
                    <div className="flex justify-center w-full">
                      <InteractiveHoverButton 
                        onClick={handleStartVisit}
                        className="hidden md:block bg-white text-black text-base font-normal"
                      >
                        {t('comecar_visita')} 
                      </InteractiveHoverButton>
                      <motion.button  
                        onClick={handleStartVisit}
                        className="md:hidden px-4 py-2 rounded-[20px] bg-white text-black text-base font-normal"
                      >
                        {t('comecar_visita')} 
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </Section>
              
              {/* SECÇÃO VISITA GUIADA */}
              <Section id="visita-guiada" className="bg-white">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "99%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="mt-5 mx-auto h-px bg-black my-0"
                  />
                  
                  <motion.div 
                    className='pt-[79px]'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                  >
                      <div className="inline-block px-7 py-1 text-sm bg-white border border-black rounded-full mb-4">
                          {t('visita_guiada')} 
                      </div>

                      <div className="flex flex-col md:flex-row md:space-x-12">
                          <div className="md:w-1/3 mb-4 md:mb-0">
                              <h2 className="text-4xl">
                                  Copy Copy <br />
                                  <span className="font-bold">Copy Copy</span>
                              </h2>
                          </div>

                          <div className="md:w-2/3">
                              <p className="text-lg leading-relaxed">
                                  {t('racismo_paragrafo')} 
                              </p>
                          </div>
                      </div>
                  </motion.div>

                  <ResourceCarousel cardData={cardData} t={t} />
              </Section>

              {/* SECÇÃO SOBRE NÓS */}
              <Section id="sobre-nos" className="bg-[#E9E8E3]">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mt-12 max-w-5xl mx-auto mb-20"
                  >
                      <div className="inline-block px-7 py-1 text-sm bg-[#E9E8E3] border border-black rounded-full mb-4">
                          {t('sobre_nos')} 
                      </div>
                      <div className="flex flex-col md:flex-row md:space-x-12">
                          <div className="md:w-1/3 mb-4 md:mb-0">
                              <h2 className="text-3xl ">
                                  {t('construir_narrativa_1')} <br />
                                  <span className='font-bold'>{t('construir_narrativa_2')}</span>
                              </h2>
                          </div>
                          <div className="md:w-2/3">
                              <p>{t('sobre_nos_texto_1')}</p>
                          </div>
                      </div>                
                  </motion.div>   
              </Section>

              <motion.img 
                  initial={{ opacity: 0, filter: "grayscale(100%)" }}
                  whileInView={{ opacity: 1, filter: "grayscale(0%)" }}
                  transition={{ duration: 1.5 }}
                  src="./assets/images/city.png" 
                  alt="View" 
                  className="w-full h-[363px] object-cover object-center"
              />
              
              {/* OPINIÃO E CONTACTOS */}
              <Section id="contactos" className="bg-white">
                  <div className='pt-[79px]'>
                      <div className="mt-5 w-[99%] mx-auto h-px bg-black my-0"></div>      
                  </div>
              
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInUp}
                    className="mt-20 max-w-6xl mx-auto px-4 mb-20"
                  >
                      <div className="inline-block px-7 py-1 text-sm bg-white border border-black rounded-full mb-4">
                          {t('opiniao_1')}
                      </div>
                      
                      <h2 className="text-2xl leading-tight mb-10">
                          {t('construir_opiniao_1')} <br />
                          <span className="font-bold">{t('construir_opiniao_2')}</span>
                      </h2>
                          
                      <div className="flex flex-col md:flex-row md:space-x-24">
                        <div className="md:w-1/2">
                            <OpinionForm t={t} />
                        </div>
                                
                        <motion.div 
                            className="md:w-1/2 space-y-6 mt-10 md:mt-0"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                          >
                            {/* Conteúdo dos contactos mantido igual */}
                          <div
                            className="space-y-5 text-[15px] text-black"
                          >
                            <p>
                                <span className="block font-medium">{t('camara')}</span>
                                <span className="block">{t('morada_camara')}</span>
                            </p>
                            <p>
                                {t('tel')} <span className="underline">{t('tel_1')}</span> <br/> 
                                <span className="text-xs">{t('tel_2')}</span>
                            </p>
                            <p>
                                {t('email_1')} <span className="underline">{t('email_2')}</span>
                            </p>
                            <p>
                                {t('atendimento_1')} <br/>
                                <span className="underline">{t('atendimento_2')}</span>
                            </p>
                            <p>
                                {t('encarregado_1')} <br/>
                                <span className="underline">{t('encarregado_2')}</span>
                            </p>
                          </div>
                        </motion.div>
                      </div>
                  </motion.div>           
              </Section>
            </main>

            <Footer t={t} sections={sectionsWithKeys} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;