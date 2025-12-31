import React from 'react';

const Footer = ({ t, sections }) => { 
    
    const handleFooterNavigation = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const HEADER_OFFSET = 70;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - HEADER_OFFSET;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <footer className="bg-[#E9E8E3] text-black w-full pt-16 pb-0"> 
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                
                <div className="flex flex-col md:flex-row w-full mb-12 items-start justify-between">
                    
                    {/* COLUNA 1: Logo e Navegação */}
                    <div className="w-full md:w-1/2 flex flex-col mb-12 md:mb-0">
                        <h1 className="text-3xl font-bold mb-10 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <span className="setubal-style">Setúbal</span>
                            <span className="negra-style font-bold"> Negra</span>
                        </h1>

                        <nav className="flex flex-col w-full max-w-full md:max-w-[300px]">
                            {sections
                                .filter(section => 
                                    section.id !== 'opiniao' && 
                                    section.nameKey !== 'deixa_opiniao' && 
                                    !section.nameKey.includes('opiniao')
                                )
                                .map((section, index, filteredArray) => (
                                <div key={section.id}>
                                    <a
                                        onClick={() => handleFooterNavigation(section.id)}
                                        className="block py-4 text-[28px] md:text-[30px] cursor-pointer hover:opacity-60 transition"
                                    >
                                        {t(section.nameKey)}
                                    </a>
                                    
                                    {index !== filteredArray.length - 1 && (
                                        <div className="w-full h-px bg-black opacity-20" />
                                    )}
                                </div>
                                ))
                            }
                            
                            
                        </nav>
                    </div>

                    {/* COLUNA 2: Contactos (Escondido no Mobile, Visível no Desktop) */}
                    {/* A classe 'hidden md:flex' garante que esta parte desaparece no telemóvel */}
                    <div className="hidden md:flex w-1/2 flex-row justify-between pt-0 gap-10">
                        <div className="w-1/2 space-y-6 flex flex-col text-[14px]">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p>{t('camara')}</p>
                                    <p>{t('morada_camara')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p>Telf.: <span className="underline underline-offset-4">{t('tel_1')}</span></p>
                                    <p className="text-[12px]">(chamada para a rede fixa nacional)</p>
                                </div>
                                <p>Email: <span className="underline underline-offset-4">{t('email_2')}</span></p>
                            </div>
                        </div>

                        <div className="w-1/2 space-y-6 text-[14px] pl-4">
                            <div className="space-y-1">
                                <p>Atendimento:</p>
                                <p className="underline underline-offset-4">{t('atendimento_2')}</p>
                            </div>
                            <div className="space-y-1">
                                <p>Encarregado de Proteção de Dados:</p>
                                <p className="underline underline-offset-4">{t('encarregado_2')}</p>
                            </div>
                        </div>
                    </div>

                    {/* REDES SOCIAIS (Aparecem logo após o botão no Mobile) */}
                    <div className="hidden md:flex space-x-6 mt-16 md:hidden">
                        <img src='./assets/insta.png' alt="Instagram" className='w-8 h-8 cursor-pointer' />
                        <img src='./assets/facebook.png' alt="Facebook" className='w-8 h-8 cursor-pointer' />
                        <img src='./assets/linkedin.png' alt="Linkedin" className='w-8 h-8 cursor-pointer' />
                        <img src='./assets/youtube.png' alt="Youtube" className='w-8 h-8 cursor-pointer' />
                    </div>
                </div>

                {/* SECÇÃO FINAL: Organização e Links Legais */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-12 pb-16 space-y-12 md:space-y-0">
                    
                    <div className="flex flex-col space-y-4 w-full md:w-auto">
                        <p className="text-[12px]">{t('organizacao')}</p>
                        <div className="flex items-center space-x-8">
                            <img src="assets/setubal.png" alt="Setúbal" className="h-28 md:h-24 w-auto object-contain" />
                            <img src="assets/ips.png" alt="IPS" className="h-24 md:h-20 w-auto object-contain" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-4 text-[13px] font-medium w-full md:w-auto md:flex-row md:gap-x-8">
                        <a href="#" className="transition">Termos e Condições de Uso</a>
                        <a href="#" className="transition">Política de Privacidade</a>
                        <a href="#" className="transition">Política de Cookies</a>
                    </div>
                </div>
            </div>

            <div className="bg-white py-6 w-full">
                <p className="text-center text-[11px] font-medium">
                    © 2025 Todos os direitos reservados
                </p>
            </div>
        </footer>
    );
};

export default Footer;