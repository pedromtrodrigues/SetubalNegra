import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const ResponsiveHeader = ({ activeLang, handleLangChange, t, sections, onNavigate, transparent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      setIsScrolled(window.scrollY > 20);
      
      if (isOpen) return; 
      if (window.scrollY > lastScrollY && window.scrollY > 100) { 
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavigation = (id) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      <header className={`
        fixed top-0 w-full z-50 h-20 flex flex-col justify-center transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isScrolled ? 'shadow-md' : 'shadow-none'} 
        ${transparent 
          ? (isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white/40 backdrop-blur-md') 
          : 'bg-[#E9E8E3] '}
      `}>
        <div className="w-full px-6 md:px-20">
          <div className="flex items-center justify-between w-full">
            <h1 className="cursor-pointer text-[30px]" onClick={() => handleNavigation('top')}>
              Setúbal <span className="font-bold">Negra</span>
            </h1>

            <nav className="hidden md:flex items-center space-x-12">
              {sections.map((section) => (
                <a 
                  key={section.id}
                  onClick={() => handleNavigation(section.id)} 
                  className="cursor-pointer font-medium hover:opacity-60 transition"
                >
                  {t(section.nameKey)}
                </a>
              ))}
              
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-1 uppercase font-medium"
                >
                  <span>{activeLang}</span>
                  <ChevronDown size={16} className={isLangOpen ? 'rotate-180' : ''} />
                </button>
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-md z-[110] shadow-lg">
                    {['PT', 'EN'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { handleLangChange(lang); setIsLangOpen(false); }}
                        className="block w-full px-4 py-2 text-sm hover:bg-black/5 transition-colors"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <button className="md:hidden p-2" onClick={() => setIsOpen(true)}>
              <Menu size={28} />
            </button>
          </div>

          <div className={`absolute bottom-0 w-full h-[1px] bg-black transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-30'}`}></div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY (Restaurado o teu CSS original) --- */}
       <div
        className={`fixed inset-0 z-[100] bg-[#E9E8E3] md:hidden transition-transform duration-500 ease-in-out transform 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center px-8 h-24">
              <h1 className="text-[28px]" onClick={() => handleNavigation('top')}>
                Setúbal <span className="font-bold">Negra</span>
              </h1>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-white p-2 rounded-full shadow-sm flex items-center justify-center"
              >
                <X size={24} className="text-black" />
              </button>
            </div>

            <div className="w-full px-8">
              <div className="w-full h-[1px] bg-black"></div>
            </div>

            <nav className="flex flex-col px-8 mt-4">
              {sections.map((section) => (
                <div key={section.id} className="flex flex-col">
                  <a 
                    onClick={() => handleNavigation(section.id)}
                    className="text-[22px] py-5 text-black cursor-pointer leading-none"
                  >
                    {t(section.nameKey)}
                  </a>
                  {section.id !== 'contactos' && (
                    <div className="w-full h-[1px] bg-black"></div>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer do Mobile - Voltei a meter as tuas margens e tamanhos exatos */}
            <div className="mt-auto p-8">
              <div className="flex space-x-4 justify-center mb-12">
                {['PT', 'EN'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLangChange(lang)}
                    className={`w-20 py-2 rounded-full border border-black text-sm transition-all
                      ${activeLang === lang ? 'bg-white border-white' : 'bg-transparent'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex flex-col space-y-2">
                <p className="text-[12px]">{t('organizacao')}</p>
                <div className="flex items-center space-x-3">
                  <img src="./assets/logos/setubal.png" alt="Setubal" className="h-[100px] mt-7 w-auto object-contain" />
                  <img src="./assets/logos/ips.png" alt="IPS" className="h-[90px] mt-6 w-auto object-contain" />
                  <img src="./assets/logos/PRR.png" alt="PRR" className="h-[90px] w-auto object-contain" />
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveHeader;