// components/ResourceCard.jsx

import React from 'react';

const ResourceCard = ({ imageSrc, epsKey, titleKey, descriptionKey, t }) => {
  return (
    <div className="rounded-xl overflow-hidden group">
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={imageSrc} 
          alt={t(epsKey)} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/A3A3A3/FFFFFF?text=Imagem"}}
        />
      </div>
      <div className="p-4">
        <h3 className="">
          {t(epsKey)} - 
        </h3>
        <h3 className="font-bold mb-1">
          {t(titleKey)} 
        </h3>
        {/* SUBTÍTULO: Agora usa epsKey ("Episódio 1") */}
        
      </div>
    </div>
  );
};

export default ResourceCard;