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
      className="bg-white p-4 rounded-xl"
    >
      {/* NOME */}
      <div className="mb-4">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full px-4 py-2
            border border-black
            rounded-full
            text-xs tracking-wide
            placeholder-grey
            uppercase
          "
          placeholder={t('nome_label') || 'NOME'}
        />
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full px-4 py-2
            border border-black
            rounded-full
            text-xs tracking-wide
            placeholder-grey
            uppercase
          "
          placeholder={t('email_label') || 'EMAIL'}
        />
      </div>

      {/* MENSAGEM */}
      <div className="mb-5">
        <textarea
          id="opinion"
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          rows={4}
          required
          className="
            w-full px-4 py-2
            border border-black
            rounded-3xl
            text-xs tracking-wide
            placeholder-grey
            uppercase
          "
          placeholder={t('opiniao_label') || 'MENSAGEM'}
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
