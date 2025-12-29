// components/Section.jsx

import React from 'react';

const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`pt-16 pb-12 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
      {children}
    </div>
  </section>
);

export default Section;