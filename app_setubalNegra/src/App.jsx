// App.jsx (Versão Final com Integração de Mapa)

import React, { useState, useCallback } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';

// 1. IMPORTAÇÕES DA TRADUÇÃO E UTILIDADES
import { useTranslation } from './Translation'; 
import { scrollToSection } from './utils/ScrollUtils'; 
import { cardData } from './data/CardData'; 

// 2. IMPORTAÇÕES DOS COMPONENTES
import ResponsiveHeader from './components/ResponsiveHeader';
import Section from './components/Section';
import ResourceCarousel from './components/ResourceCarousel';
import OpinionForm from './components/OpinionForm';
import Footer from './components/Footer';
import MapPage from './components/MapPage'; // Certifica-te de criar este componente

const BACKGROUND_COLOR = 'bg-[#EBECE6]'; 

// Estrutura das Secções
const sectionsWithKeys = [
  { nameKey: 'visita_guiada', id: 'visita-guiada'},
  { nameKey: 'sobre_nos', id: 'sobre-nos'},
  { nameKey: 'opiniao', id: 'opiniao'},
  { nameKey: 'contactos', id: 'contactos'},
];

const App = () => {
  const [activeSection, setActiveSection] = useState('top');
  
  // ESTADO PARA CONTROLAR A VISIBILIDADE DO MAPA
  const [showMap, setShowMap] = useState(false);
  
  // LÓGICA DE IDIOMA CENTRALIZADA
  const [activeLang, setActiveLang] = useState('PT'); 
  const t = useTranslation(activeLang); 
  
  const handleLangChange = useCallback((lang) => {
      setActiveLang(lang);
  }, []);

  const handleNavigation = useCallback((id) => {
    setActiveSection(id);
    scrollToSection(id);
  }, []);

    // SE O MAPA ESTIVER ATIVO, RENDERIZA APENAS O COMPONENTE DO MAPA

 if (showMap) {
    return (
        <MapPage 
        onBack={() => setShowMap(false)} 
        t={t} 
        activeLang={activeLang} 
        handleLangChange={handleLangChange} // ADICIONA ESTA LINHA
        />);
 }

  return (
    <div className={`min-h-screen font-sans ${BACKGROUND_COLOR}`} id="top"> 
      
      <ResponsiveHeader 
        onNavigate={handleNavigation} 
        activeLang={activeLang}
        handleLangChange={handleLangChange}
        sections={sectionsWithKeys}
        t={t} 
      /> 

      <main>
        
        {/* SECÇÃO HERO / PINTURA */}
        <Section id="hero" className="min-h-screen flex items-center justify-center pt-24 pb-0 md:pb-12 bg-[#E9E8E3]"> 
          <div className="w-full text-center">
            <div className="">
                <img 
                    src="./assets/Principal.png" 
                    alt="Pintura Setúbal Negra" 
                    className="w-full h-auto object-cover rounded-md"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/500x500/A3A3A3/FFFFFF?text=Pintura+Principal"}}
                />
                
                {/* BOTÃO ALTERADO: Agora ativa o estado showMap */}
                <button 
                    onClick={() => {
                        window.scrollTo(0, 0); // Força o topo
                        setShowMap(true);
                    }}
                    className="mt-4 px-8 py-3 bg-white text-black text-base font-normal rounded-[20px]  transition duration-150 inline-flex justify-center items-center"
                >
                    {t('comecar_visita')} 
                </button>
            </div>
          </div>
        </Section>
        
        {/* SECÇÃO VISITA GUIADA + INTRODUÇÃO */}
        <Section id="visita-guiada" className="bg-white">
            <div className="mt-5 w-[99%] mx-auto h-px bg-black my-0"></div>
            <div className='pt-[79px]'>
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
            </div>

            <div className="mt-20">
                <ResourceCarousel 
                    cardData={cardData}
                    t={t} 
                />
            </div>
        </Section>

        {/* SECÇÃO SOBRE NÓS */}
        <Section id="sobre-nos" className="bg-[#E9E8E3]">
            <div className="mt-5 w-[99%] mx-auto h-px bg-black my-0"></div>
            <div className="mt-12 max-w-5xl mx-auto mb-20">
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
                        <p>
                            {t('sobre_nos_texto_1')} 
                        </p>
                    </div>
                </div>                
            </div>   
        </Section>

        <img 
            src="./assets/city.png" 
            alt="View" 
            className="w-full h-[363px] object-cover object-center"
        />
        
        {/* SECÇÃO DEIXA-NOS A TUA OPINIÃO */}
        <Section id="opiniao" className="bg-white">
            <div className='pt-[79px]'>
                <div className="mt-5 w-[99%] mx-auto h-px bg-black my-0"></div>      
            </div>
        
            <div className="mt-20 max-w-6xl mx-auto px-4 mb-20">
                <div className="inline-block px-7 py-1 text-sm bg-white border border-black rounded-full mb-4">
                    {t('opiniao_1')}
                </div>

                <div className="flex flex-col md:flex-row md:space-x-24">
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-2xl leading-tight uppercase tracking-tight mb-10">
                            {t('construir_opiniao_1')} <br />
                            <span className="font-bold">{t('construir_opiniao_2')}</span>
                        </h2>

                        <div className="space-y-5 text-[15px] text-black">
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
                    </div>

                    <div className="md:w-1/2 mt-10 md:mt-0">
                        <OpinionForm t={t} />
                    </div>
                </div>
            </div>           
        </Section>

      </main>

      <Footer 
        t={t} 
        sections={sectionsWithKeys} 
      />
    </div>
  );
};

export default App;