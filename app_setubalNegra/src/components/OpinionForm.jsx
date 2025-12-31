// components/OpinionForm.jsx

import React, { useState } from 'react';

const OpinionForm = ({ t }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [opinion, setOpinion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Opinião enviada:', { name, email, opinion });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setEmail('');
      setOpinion('');
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-2">
          {t('obrigado_titulo')}
        </h3>
        <p>{t('obrigado_desc')}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl"
    >
      {/* Mensagem */}
      <div className="mb-4">
        <textarea
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
          w-full px-6 py-5 h-[300px]
          border border-black/40
          rounded-[30px] font-medium
          text-[15px] focus:outline-none
          focus:ring-0
          focus:border-black
          resize-none
          "
          placeholder={t('mensagem_label') || 'Mensagem'}
        />
      </div>

      {/* BOTÃO ENVIAR – alinhado à direita, estilo pill preto */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!opinion}
          className="
            inline-flex items-center justify-center
            px-6 py-2
            rounded-full
            text-xs font-medium
            bg-black text-white
            placeholder-grey
            transition
          "
        >
          {t('enviar_opiniao') || 'Enviar'}
        </button>
      </div>
    </form>
  );
};

export default OpinionForm;
