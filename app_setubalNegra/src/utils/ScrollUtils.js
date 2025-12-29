// utils/ScrollUtils.js

export const scrollToSection = (id) => {
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