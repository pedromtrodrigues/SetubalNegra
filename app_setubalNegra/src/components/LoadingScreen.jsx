import { motion } from "framer-motion";

const LoadingScreen = ({ t }) => {
    
    
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#E9E8E3]"
    >
      <div className="relative flex items-center justify-center">
        {/* Círculo que gira usando Framer Motion */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-24 w-24 rounded-full border-t-2 border-b-2 border-black"
        />
        
        {/* Texto SN no centro do círculo */}
        <span className="font-sans absolute text-2xl font-bold text-black">
          SN
        </span>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-sans mt-6 text-black items-center"
      >
        {t('experiencia')}
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;