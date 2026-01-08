import { motion } from 'framer-motion';

export const ScrollReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // Começa invisível e 30px abaixo
      whileInView={{ opacity: 1, y: 0 }} // Quando entra no ecrã, sobe e aparece
      viewport={{ once: true, amount: 0.2 }} // Anima apenas uma vez quando 20% estiver visível
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};